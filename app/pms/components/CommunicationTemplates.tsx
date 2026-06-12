'use client';

import { useState } from 'react';
import { useLanguage as useLanguage } from '../LanguageContext';
import { MessageSquare, Plus, Edit2, Trash2, Send, Copy } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'pre-arrival' | 'check-in' | 'post-stay' | 'issue' | 'custom';
  subject: string;
  body: string;
  usageCount: number;
  lastUsed: string;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Pre-Arrival Welcome',
    category: 'pre-arrival',
    subject: 'Welcome to {{propertyName}} - Your Arrival is Coming Soon!',
    body: `Hi {{guestName}},

We're excited to welcome you to {{propertyName}}! Your check-in date is {{checkInDate}}.

Here are a few important details:
- Check-in time: 3:00 PM
- Check-out time: 11:00 AM
- WiFi Password: {{wifiPassword}}
- Property Address: {{address}}

If you have any questions, please don't hesitate to reach out.

Best regards,
{{hostName}}`,
    usageCount: 24,
    lastUsed: '2 days ago',
  },
  {
    id: '2',
    name: 'Check-In Instructions',
    category: 'check-in',
    subject: 'Check-In Instructions for {{propertyName}}',
    body: `Hello {{guestName}},

Welcome! Here's how to check in:

1. The key code is: {{keyCode}}
2. Enter through the main door
3. The lockbox is located {{lockboxLocation}}
4. Parking is available {{parkingInfo}}

Please confirm receipt of this message.

Enjoy your stay!
{{hostName}}`,
    usageCount: 28,
    lastUsed: 'today',
  },
  {
    id: '3',
    name: 'Post-Stay Thank You',
    category: 'post-stay',
    subject: 'Thank You for Staying at {{propertyName}}!',
    body: `Dear {{guestName}},

Thank you for choosing {{propertyName}}! We hope you had a wonderful stay.

Your feedback is valuable to us. If you'd like to leave a review on {{platform}}, we'd greatly appreciate it!

{{reviewLink}}

We'd love to welcome you again in the future.

Warm regards,
{{hostName}}`,
    usageCount: 18,
    lastUsed: '3 days ago',
  },
  {
    id: '4',
    name: 'Issue Resolution',
    category: 'issue',
    subject: 'Let\'s Resolve This - {{propertyName}}',
    body: `Hi {{guestName}},

We're sorry to hear about the issue with {{issueType}}. We're here to help!

Here's what we'll do:
- {{actionItem1}}
- {{actionItem2}}
- {{followUpDate}}

Please let us know if you need anything else.

Best regards,
{{hostName}}`,
    usageCount: 5,
    lastUsed: '1 week ago',
  },
];

export default function CommunicationTemplates() {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    category: 'custom',
    subject: '',
    body: '',
  });

  const handleSaveTemplate = () => {
    if (editingId) {
      setTemplates(templates.map(t => 
        t.id === editingId 
          ? { ...t, ...(newTemplate as Partial<Template>) }
          : t
      ));
      setEditingId(null);
    } else {
      const template: Template = {
        id: Date.now().toString(),
        name: newTemplate.name || 'Untitled',
        category: newTemplate.category || 'custom',
        subject: newTemplate.subject || '',
        body: newTemplate.body || '',
        usageCount: 0,
        lastUsed: 'never',
      };
      setTemplates([...templates, template]);
      setShowNewForm(false);
    }
    setNewTemplate({ name: '', category: 'custom', subject: '', body: '' });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    if (selectedTemplate?.id === id) setSelectedTemplate(null);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingId(template.id);
    setNewTemplate(template);
    setShowNewForm(true);
  };

  const categoryColors = {
    'pre-arrival': 'bg-blue-500/10 text-blue-600',
    'check-in': 'bg-green-500/10 text-green-600',
    'post-stay': 'bg-purple-500/10 text-purple-600',
    'issue': 'bg-red-500/10 text-red-600',
    'custom': 'bg-card/500/10 text-foreground/70',
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-foreground/60">Total Templates</p>
          <p className="text-3xl font-bold text-primary mt-2">{templates.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-foreground/60">Most Used</p>
          <p className="text-lg font-bold mt-2">
            {templates.reduce((max, t) => t.usageCount > max.usageCount ? t : max).name}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-foreground/60">Total Messages Sent</p>
          <p className="text-3xl font-bold text-accent mt-2">
            {templates.reduce((sum, t) => sum + t.usageCount, 0)}
          </p>
        </div>
      </div>

      {/* Add New Template Button */}
      <button
        onClick={() => {
          setEditingId(null);
          setShowNewForm(!showNewForm);
          setNewTemplate({ name: '', category: 'custom', subject: '', body: '' });
        }}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-foreground rounded-lg font-medium hover:bg-primary/90 transition"
      >
        <Plus className="w-4 h-4" />
        Create Template
      </button>

      {/* New/Edit Template Form */}
      {showNewForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {editingId ? 'Edit Template' : 'Create New Template'}
          </h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Template Name</label>
            <input
              type="text"
              placeholder="e.g., Welcome Message"
              value={newTemplate.name || ''}
              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={newTemplate.category || 'custom'}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                <option value="pre-arrival">Pre-Arrival</option>
                <option value="check-in">Check-In</option>
                <option value="post-stay">Post-Stay</option>
                <option value="issue">Issue Resolution</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Subject</label>
            <input
              type="text"
              placeholder="Message subject"
              value={newTemplate.subject || ''}
              onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message Body</label>
            <textarea
              placeholder="Use {{guestName}}, {{propertyName}}, etc. for placeholders"
              value={newTemplate.body || ''}
              onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono"
            />
            <p className="text-xs text-foreground/50 mt-2">
              Available placeholders: {'{guestName}'} {'{propertyName}'} {'{checkInDate}'} {'{checkOutDate}'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveTemplate}
              className="flex-1 px-4 py-2 bg-primary text-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              {editingId ? 'Update Template' : 'Create Template'}
            </button>
            <button
              onClick={() => {
                setShowNewForm(false);
                setEditingId(null);
                setNewTemplate({});
              }}
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg font-medium hover:bg-background/80 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map(template => (
          <div
            key={template.id}
            className={`bg-card border rounded-lg p-6 cursor-pointer transition ${
              selectedTemplate?.id === template.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedTemplate(selectedTemplate?.id === template.id ? null : template)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-4 h-4 text-foreground/60 flex-shrink-0" />
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${categoryColors[template.category]}`}>
                    {template.category.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-foreground/60 line-clamp-2">{template.subject}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTemplate(template);
                  }}
                  className="p-2 hover:bg-background rounded transition"
                >
                  <Edit2 className="w-4 h-4 text-foreground/60" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(template.id);
                  }}
                  className="p-2 hover:bg-background rounded transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedTemplate?.id === template.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div>
                  <p className="text-xs font-semibold text-foreground/60 mb-1">SUBJECT</p>
                  <p className="text-sm">{template.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/60 mb-1">MESSAGE</p>
                  <p className="text-sm whitespace-pre-wrap font-mono">{template.body}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex gap-4 text-xs text-foreground/60">
                    <span>{template.usageCount} times used</span>
                    <span>Last used: {template.lastUsed}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded text-sm font-medium hover:bg-primary/20 transition">
                      <Copy className="w-3 h-3" />
                      Duplicate
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded text-sm font-medium hover:bg-accent/20 transition">
                      <Send className="w-3 h-3" />
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Compact View */}
            {selectedTemplate?.id !== template.id && (
              <div className="flex items-center gap-4 text-xs text-foreground/60 mt-2">
                <span>{template.usageCount} used</span>
                <span>Last: {template.lastUsed}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
