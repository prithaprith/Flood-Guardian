import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpingHand, BriefcaseMedical } from "lucide-react";

import {
  Phone,
  MapPin,
  Bluetooth,
  Share2,
  ArrowLeft,
  AlertTriangle,
  PhoneCall,
  Building,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
interface EmergencyContact {
  name: string;
  phone: string;
}

const EmergencySosPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNgoModal, setShowNgoModal] = useState(false);
  const [showFloodAlert, setShowFloodAlert] = useState(false);

  const [gpsStatus, setGpsStatus] = useState<
    "acquiring" | "acquired" | "unavailable"
  >("acquiring");
  const [bluetoothStatus, setBluetoothStatus] = useState<
    "connected" | "disconnected"
  >("disconnected");
  // Mock GPS and Bluetooth status
  useEffect(() => {
    const timer = setTimeout(() => {
      setGpsStatus("acquired");
      setBluetoothStatus("connected");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  const handleSOSCall = () => {
    toast({
      title: "Emergency SOS Activated",
      description: "Contacting emergency services...",
      variant: "destructive",
    });
  };
  const handleEmergencyService = () => {
    window.location.href = "tel:112";
  };

  const handleDisasterOffice = () => {
    window.location.href = "tel:112";
  };
  const handleBluetoothSOS = () => {
    toast({
      title: "Bluetooth SOS Signal Sent",
      description: "Nearby volunteers have been alerted",
    });
  };
  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: "Emergency Location",
        text: "I need help! My current location:",
        url: window.location.href,
      });
    } else {
      toast({
        title: "Location Shared",
        description: "Location copied to clipboard",
      });
    }
  };
  const [emergencyContacts, setEmergencyContacts] = useState<
    { name: string; phone: string }[]
  >([]);

  useEffect(() => {
    const storedContacts = localStorage.getItem("emergencyContacts");
    if (storedContacts) {
      const parsed = JSON.parse(storedContacts);
      setEmergencyContacts(
        parsed.filter((c: EmergencyContact) => c.name && c.phone).slice(0, 3)
      );
    }
  }, []);

  const [showNgoList, setShowNgoList] = useState(false);
  const ngoList = [
    { name: "YOUNG STARS ASSOCIATION", phone: "08064443668" },
    {
      name: "WORLD PEACE & CLIMATE CHANGE DIPLOMATICAFOLABI",
      phone: "07046571997",
    },
    {
      name: "HOPE ABILITY EMPOWERMENT INITIATIVE",
      phone: "07060507551",
    },
    {
      name: "HEALTH EMPOWERMENT AND DEVELOPMENT ACTION",
      phone: "08184358855",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Emergency SOS</h1>
        <div className="w-10" />
      </div>
      {/* Status Display */}
      <Card className="p-4 mb-6 bg-card/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">GPS Status:</span>
            <div className="flex items-center space-x-1">
              {gpsStatus === "acquired" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : gpsStatus === "unavailable" ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
              <span className="text-sm capitalize text-muted-foreground">
                {gpsStatus}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Bluetooth className="h-5 w-5 text-primary" />
            <div className="flex items-center space-x-1">
              {bluetoothStatus === "connected" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm capitalize text-muted-foreground">
                {bluetoothStatus}
              </span>
            </div>
          </div>
        </div>
      </Card>
      {/* Main SOS Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleSOSCall}
          className="w-48 h-48 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-2xl animate-pulse hover:animate-none transition-all duration-300 active:scale-95"
          size="lg"
        >
          <div className="flex flex-col items-center space-y-2">
            <AlertTriangle className="h-12 w-12" />
            <span className="text-2xl font-bold">SOS</span>
            <span className="text-sm">EMERGENCY</span>
          </div>
        </Button>
      </div>
      {/* Quick Action Tiles */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-card/50 backdrop-blur-sm"
          onClick={handleEmergencyService}
        >
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <PhoneCall className="h-6 w-6 text-red-600" />
            </div>
            <span className="font-medium text-sm">Emergency</span>
            <span className="text-xs text-muted-foreground">Call 112</span>
          </div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-card/50 backdrop-blur-sm"
          onClick={handleDisasterOffice}
        >
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <span className="font-medium text-sm">Law Enforcement</span>
            <span className="text-xs text-muted-foreground">Call 199</span>
          </div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-card/50 backdrop-blur-sm"
          onClick={handleBluetoothSOS}
        >
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Bluetooth className="h-6 w-6 text-purple-600" />
            </div>
            <span className="font-medium text-sm">Bluetooth SOS</span>
            <span className="text-xs text-muted-foreground">Alert Nearby</span>
          </div>
        </Card>
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-card/50 backdrop-blur-sm"
          onClick={handleShareLocation}
        >
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Share2 className="h-6 w-6 text-green-600" />
            </div>
            <span className="font-medium text-sm">Share Location</span>
            <span className="text-xs text-muted-foreground">
              Send to Contacts
            </span>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-card/50 backdrop-blur-sm"
          onClick={() => setShowNgoModal(true)}
        >
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <BriefcaseMedical className="h-6 w-6 text-green-600" />
            </div>
            <span className="font-medium text-sm">
              NGO and Relief Organization
            </span>
            <span className="text-xs text-muted-foreground">
              Find Help Nearby
            </span>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 bg-card/50 backdrop-blur-sm"
          onClick={handleShareLocation}
        >
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="font-medium text-sm">
              Community Based Volunteer
            </span>
            <span className="text-xs text-muted-foreground">
              Connect with Locals
            </span>
          </div>
        </Card>
      </div>

      {showNgoModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-background rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowNgoModal(false)}
            >
              <XCircle className="h-5 w-5" />
            </button>

            {/* Modal Title */}
            <h2 className="text-lg font-semibold mb-4 text-center">
              NGO and Relief Organizations
            </h2>

            {/* NGO List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {ngoList.map((ngo, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border border-border rounded-xl p-3 bg-background/50 hover:shadow-md transition"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{ngo.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {ngo.phone}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => (window.location.href = `tel:${ngo.phone}`)}
                  >
                    Call
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-medium">Emergency Contacts</span>
        </div>
        <div className="flex justify-center space-x-4">
          {emergencyContacts.map((contact, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 w-16 rounded-full p-0 flex flex-col items-center justify-center bg-background/50"
              onClick={() => (window.location.href = `tel:${contact.phone}`)}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mb-1">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs">{contact.name}</span>
            </Button>
          ))}
        </div>
      </Card>
      {showFloodAlert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg max-w-md w-full animate-pulse border-4 border-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">⚠️ FLOOD WARNING</h2>
              <button
                className="text-white text-sm"
                onClick={() => setShowFloodAlert(false)}
              >
                Close
              </button>
            </div>
            <p className="text-sm leading-relaxed">
              🚨 *Flood Alert Issued!* Immediate action is advised. Rising water
              levels detected in your area.
              <br />
              <br />
              ✅ Move to higher ground
              <br />
              ✅ Keep emergency supplies ready
              <br />✅ Avoid roads and flood zones
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setShowFloodAlert(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          Simulate Flood Alert
        </Button>
      </div>
    </div>
  );
};
export default EmergencySosPage;
