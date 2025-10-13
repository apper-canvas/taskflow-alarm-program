import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import projectService from "@/services/api/projectService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ProjectCard from "@/components/organisms/ProjectCard";
import ProjectModal from "@/components/organisms/ProjectModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Projects = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    projects.forEach(project => {
      if (project.Tags) {
        project.Tags.split(',').forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) tags.add(trimmed);
        });
      }
    });
    return Array.from(tags);
  }, [projects]);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch = 
        (project.name_c || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description_c || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag || 
        (project.Tags && project.Tags.split(',').map(t => t.trim()).includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name_c || "").localeCompare(b.name_c || "");
        case "createdAt":
        default:
          return new Date(b.CreatedOn || 0) - new Date(a.CreatedOn || 0);
      }
    });

    return filtered;
  }, [projects, searchQuery, selectedTag, sortBy]);

  const handleNewProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        const updated = await projectService.update(editingProject.Id, projectData);
        if (updated) {
          setProjects(prev => prev.map(p => p.Id === editingProject.Id ? updated : p));
          setIsModalOpen(false);
          setEditingProject(null);
        }
      } else {
        const created = await projectService.create(projectData);
        if (created) {
          setProjects(prev => [created, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      toast.error("Failed to save project");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    const success = await projectService.delete(id);
    if (success) {
      setProjects(prev => prev.filter(p => p.Id !== id));
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProjects} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              <span>Back to Tasks</span>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Projects</h1>
              <p className="text-slate-600 mt-1">Manage your project portfolio</p>
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
                placeholder="Search projects..."
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
                onClick={handleNewProject}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <ApperIcon name="Plus" size={20} />
                <span>New Project</span>
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

        {/* Projects Grid */}
        {filteredAndSortedProjects.length === 0 ? (
          <Empty
            title="No projects found"
            message={searchQuery || selectedTag ? "Try adjusting your search or filters" : "Create your first project to get started"}
            icon="FolderOpen"
            suggestions={[
              "Website Redesign",
              "Mobile App Development",
              "Marketing Campaign Q1"
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProjects.map((project) => (
                <ProjectCard
                  key={project.Id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </div>
  );
};

export default Projects;