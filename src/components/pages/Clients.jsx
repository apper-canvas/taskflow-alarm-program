import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import clientService from "@/services/api/clientService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ClientCard from "@/components/organisms/ClientCard";
import ClientModal from "@/components/organisms/ClientModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Clients = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    clients.forEach(client => {
      if (client.Tags) {
        client.Tags.split(',').forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) tags.add(trimmed);
        });
      }
    });
    return Array.from(tags);
  }, [clients]);

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter((client) => {
const parseContactInfo = (description) => {
        try {
          return JSON.parse(description || '{}');
        } catch {
          return {};
        }
      };
      const contactInfo = parseContactInfo(client.description_c);
      const matchesSearch = 
        (client.Name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contactInfo.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contactInfo.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contactInfo.company || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag ||
        (client.Tags && client.Tags.split(',').map(t => t.trim()).includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
return (a.Name || "").localeCompare(b.Name || "");
        case "createdAt":
        default:
          return new Date(b.CreatedOn || 0) - new Date(a.CreatedOn || 0);
      }
    });

    return filtered;
  }, [clients, searchQuery, selectedTag, sortBy]);

  const handleNewClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = async (clientData) => {
    try {
      if (editingClient) {
        const updated = await clientService.update(editingClient.Id, clientData);
        if (updated) {
          setClients(prev => prev.map(c => c.Id === editingClient.Id ? updated : c));
          setIsModalOpen(false);
          setEditingClient(null);
        }
      } else {
        const created = await clientService.create(clientData);
        if (created) {
          setClients(prev => [created, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      toast.error("Failed to save client");
    }
  };

  const handleDeleteClient = async (id) => {
    if (!confirm("Are you sure you want to delete this client?")) {
      return;
    }

    const success = await clientService.delete(id);
    if (success) {
      setClients(prev => prev.filter(c => c.Id !== id));
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClients} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              <span>Back to Projects</span>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Clients</h1>
              <p className="text-slate-600 mt-1">Manage your client relationships</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-slate-700">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-500">{user.emailAddress}</p>
              </div>
            )}
            <Button variant="outline" onClick={logout}>
              <ApperIcon name="LogOut" size={18} />
            </Button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery}
                placeholder="Search clients..."
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="createdAt">Newest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <Button 
                variant="primary" 
                onClick={handleNewClient}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <ApperIcon name="Plus" size={20} />
                <span>New Client</span>
              </Button>
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !selectedTag 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Tags
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clients Grid */}
        {filteredAndSortedClients.length === 0 ? (
          <Empty
            title="No clients found"
            message={searchQuery || selectedTag ? "Try adjusting your search or filters" : "Add your first client to get started"}
            icon="Users"
            suggestions={[
              "Acme Corporation",
              "Tech Innovations Inc",
              "Global Solutions Ltd"
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedClients.map((client) => (
                <ClientCard
                  key={client.Id}
                  client={client}
                  onEdit={handleEditClient}
                  onDelete={handleDeleteClient}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        client={editingClient}
      />
    </div>
  );
};

export default Clients;