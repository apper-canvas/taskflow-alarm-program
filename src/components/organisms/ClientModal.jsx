import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";

const ClientModal = ({ isOpen, onClose, onSave, client }) => {
  const [formData, setFormData] = useState({
    Name: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    Tags: ""
  });
  const [saving, setSaving] = useState(false);

  const parseContactInfo = (description) => {
    try {
      return JSON.parse(description || '{}');
    } catch {
      return {};
    }
  };

  useEffect(() => {
    if (client) {
      const contactInfo = parseContactInfo(client.description_c);
      setFormData({
Name: client.Name || "",
        email_c: contactInfo.email || "",
        phone_c: contactInfo.phone || "",
        company_c: contactInfo.company || "",
        Tags: client.Tags || ""
      });
    } else {
setFormData({
        Name: "",
        email_c: "",
        phone_c: "",
        company_c: "",
        Tags: ""
      });
    }
  }, [client, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                <ApperIcon name="Users" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {client ? "Edit Client" : "New Client"}
                </h2>
                <p className="text-sm text-slate-500">
                  {client ? "Update client information" : "Add a new client to your portfolio"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
<FormField label="Client Name" required>
              <Input
                value={formData.Name}
                onChange={(e) => handleChange("Name", e.target.value)}
                placeholder="Enter client name"
                required
              />
            </FormField>
</FormField>

            <FormField label="Email">
              <Input
                type="email"
                value={formData.email_c}
                onChange={(e) => handleChange("email_c", e.target.value)}
                placeholder="client@example.com"
              />
            </FormField>
            <FormField label="Phone">
              <Input
                type="tel"
                value={formData.phone_c}
                onChange={(e) => handleChange("phone_c", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </FormField>

            <FormField label="Company">
              <Input
                value={formData.company_c}
                onChange={(e) => handleChange("company_c", e.target.value)}
                placeholder="Company name"
              />
            </FormField>

            <FormField 
              label="Tags" 
              hint="Separate multiple tags with commas"
            >
              <Input
                value={formData.Tags}
                onChange={(e) => handleChange("Tags", e.target.value)}
                placeholder="VIP, Enterprise, Partner"
              />
            </FormField>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={saving}
              >
                {saving ? "Saving..." : client ? "Update Client" : "Create Client"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ClientModal;