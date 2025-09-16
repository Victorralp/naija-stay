import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: 'NaijaStay',
    siteDescription: 'Premium hotel booking platform for Nigerian hotels and resorts',
    contactEmail: 'info@naijastay.com',
    contactPhone: '+234 809 123 4567',
    enableNewsletter: true,
    enableContactForm: true,
    maintenanceMode: false,
    googleAnalyticsId: '',
    facebookPixelId: '',
    currency: 'NGN',
    timezone: 'Africa/Lagos'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSave = () => {
    // In a real application, this would save to a database
    toast.success('Settings saved successfully');
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    setSettings({
      siteName: 'NaijaStay',
      siteDescription: 'Premium hotel booking platform for Nigerian hotels and resorts',
      contactEmail: 'info@naijastay.com',
      contactPhone: '+234 809 123 4567',
      enableNewsletter: true,
      enableContactForm: true,
      maintenanceMode: false,
      googleAnalyticsId: '',
      facebookPixelId: '',
      currency: 'NGN',
      timezone: 'Africa/Lagos'
    });
    toast.info('Settings reset to default values');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ml-4">System Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General Settings */}
              <div>
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        value={settings.contactPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div>
                <h3 className="text-lg font-medium mb-4">Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableNewsletter">Newsletter</Label>
                      <p className="text-sm text-gray-500">Enable newsletter subscription form</p>
                    </div>
                    <Switch
                      id="enableNewsletter"
                      checked={settings.enableNewsletter}
                      onCheckedChange={(checked) => handleSwitchChange('enableNewsletter', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableContactForm">Contact Form</Label>
                      <p className="text-sm text-gray-500">Enable contact form on website</p>
                    </div>
                    <Switch
                      id="enableContactForm"
                      checked={settings.enableContactForm}
                      onCheckedChange={(checked) => handleSwitchChange('enableContactForm', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Put site in maintenance mode</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSwitchChange('maintenanceMode', checked)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Analytics */}
              <div>
                <h3 className="text-lg font-medium mb-4">Analytics</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      name="googleAnalyticsId"
                      value={settings.googleAnalyticsId}
                      onChange={handleInputChange}
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixelId"
                      name="facebookPixelId"
                      value={settings.facebookPixelId}
                      onChange={handleInputChange}
                      placeholder="XXXXXXXXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
              
              {/* Localization */}
              <div>
                <h3 className="text-lg font-medium mb-4">Localization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      name="currency"
                      value={settings.currency}
                      onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full border rounded-md p-2"
                    >
                      <option value="NGN">NGN (₦) - Nigerian Naira</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={settings.timezone}
                      onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full border rounded-md p-2"
                    >
                      <option value="Africa/Lagos">Africa/Lagos</option>
                      <option value="Africa/Abuja">Africa/Abuja</option>
                      <option value="Africa/Porto-Novo">Africa/Porto-Novo</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
              
              <Button variant="outline" onClick={handleReset} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Version</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Environment</span>
                    <span>Production</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;