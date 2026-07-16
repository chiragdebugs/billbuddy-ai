import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Shield, Smartphone, CreditCard, LogOut, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/context/ThemeProvider";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Profile State
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || user?.email?.split('@')[0] || "");
  
  // Notification State
  const [notifBills, setNotifBills] = useState(user?.user_metadata?.notif_bills ?? true);
  const [notifReminders, setNotifReminders] = useState(user?.user_metadata?.notif_reminders ?? true);
  const [notifMarketing, setNotifMarketing] = useState(user?.user_metadata?.notif_marketing ?? false);

  // Payment State
  const [upiId, setUpiId] = useState(user?.user_metadata?.upi_id || "");

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || "");
      setNotifBills(user.user_metadata?.notif_bills ?? true);
      setNotifReminders(user.user_metadata?.notif_reminders ?? true);
      setNotifMarketing(user.user_metadata?.notif_marketing ?? false);
      setUpiId(user.user_metadata?.upi_id || "");
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const saveProfile = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName }
    });
    setLoading(false);
    if (!error) showSuccess("Profile updated successfully!");
  };

  const saveNotifications = async (key: string, val: boolean) => {
    const { error } = await supabase.auth.updateUser({
      data: { [key]: val }
    });
    if (!error) showSuccess("Preferences updated!");
  };

  const savePayment = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { upi_id: upiId }
    });
    setLoading(false);
    if (!error) showSuccess("Payment methods updated!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Smartphone },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm font-medium text-green-600 border border-green-500/20 transition-all">
          <Check size={16} />
          {successMsg}
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar Tabs */}
        <div className="flex w-full flex-col gap-2 md:w-64 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
          
          <div className="my-2 border-t border-border" />
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your email address is managed by your authentication provider.
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your Name"
                    />
                  </div>
                  <Button onClick={saveProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what alerts you want to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">New Bills</h4>
                      <p className="text-xs text-muted-foreground">Get notified when someone adds you to a bill.</p>
                    </div>
                    <div 
                      onClick={() => {
                        const newVal = !notifBills;
                        setNotifBills(newVal);
                        saveNotifications("notif_bills", newVal);
                      }}
                      className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors ${notifBills ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${notifBills ? 'right-1' : 'left-1'}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Payment Reminders</h4>
                      <p className="text-xs text-muted-foreground">Get notified when a bill is due soon.</p>
                    </div>
                    <div 
                      onClick={() => {
                        const newVal = !notifReminders;
                        setNotifReminders(newVal);
                        saveNotifications("notif_reminders", newVal);
                      }}
                      className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors ${notifReminders ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${notifReminders ? 'right-1' : 'left-1'}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Marketing Emails</h4>
                      <p className="text-xs text-muted-foreground">Receive weekly roundups and feature updates.</p>
                    </div>
                    <div 
                      onClick={() => {
                        const newVal = !notifMarketing;
                        setNotifMarketing(newVal);
                        saveNotifications("notif_marketing", newVal);
                      }}
                      className={`h-6 w-11 rounded-full relative cursor-pointer transition-colors ${notifMarketing ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${notifMarketing ? 'right-1' : 'left-1'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of BillBuddy.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose a theme for your interface. It will automatically save your preference.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      onClick={() => setTheme("dark")}
                      className={`rounded-lg border-2 p-1 cursor-pointer transition-colors ${theme === 'dark' ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    >
                      <div className="h-24 rounded bg-slate-950 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">Dark</span>
                      </div>
                    </div>
                    <div 
                      onClick={() => setTheme("light")}
                      className={`rounded-lg border-2 p-1 cursor-pointer transition-colors ${theme === 'light' ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    >
                      <div className="h-24 rounded bg-slate-100 flex items-center justify-center border">
                        <span className="text-xs font-medium text-slate-900">Light</span>
                      </div>
                    </div>
                    <div 
                      onClick={() => setTheme("system")}
                      className={`rounded-lg border-2 p-1 cursor-pointer transition-colors ${theme === 'system' ? 'border-primary' : 'border-transparent hover:border-border'}`}
                    >
                      <div className="h-24 rounded bg-gradient-to-br from-slate-100 to-slate-900 flex items-center justify-center border">
                        <span className="text-xs font-medium text-white mix-blend-difference">System</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage how you send and receive money.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <CreditCard className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                    <h3 className="text-sm font-medium text-foreground">Razorpay Integration Active</h3>
                    <p className="mt-1 text-xs text-muted-foreground mb-4">
                      You can securely collect payments on your bills. Save your default VPA / UPI ID below to receive funds faster.
                    </p>
                    
                    <div className="mx-auto max-w-sm text-left">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Default UPI ID</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="e.g. name@okhdfcbank"
                        />
                        <Button onClick={savePayment} disabled={loading}>Save</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
