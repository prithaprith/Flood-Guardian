import React, { useState, useEffect, useRef } from "react";
import { Phone, User, PlusCircle } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  phone: string;
  isEmergency?: boolean;
};

type Message = {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: Date;
};

const dummyContacts: Contact[] = [
  { id: "4", name: "John Doe", phone: "+2348012345678" },
  { id: "5", name: "Jane Smith", phone: "+2348098765432" },
  { id: "6", name: "Dr. Adams", phone: "+2348031122334" },
  { id: "7", name: "Ms. Claire", phone: "+2348055566778" },
];

const MessengerPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "them",
      text: "Hello, how can I help?",
      timestamp: new Date(),
    },
    {
      id: "m2",
      sender: "me",
      text: "Hi! I need assistance with flood evacuation.",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([
    { id: "1", name: "Police", phone: "911", isEmergency: true },
    { id: "2", name: "Fire Dept.", phone: "101", isEmergency: true },
    { id: "3", name: "Ambulance", phone: "102", isEmergency: true },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("emergencyContacts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out contacts with empty name or phone
          const validContacts = parsed.filter(
            (c: Contact) => c.name?.trim() && c.phone?.trim()
          );

          setEmergencyContacts(validContacts);

          // Merge dummy contacts with cleaned emergency ones
          const merged = [
            ...dummyContacts,
            ...validContacts.map((c: Contact) => ({
              ...c,
              isEmergency: false,
            })),
          ];
          setContacts(merged);
          setSelectedContact(merged[0] || null);
        }
      } catch (err) {
        console.error(
          "Failed to load emergency contacts from localStorage",
          err
        );
        setContacts(dummyContacts);
        setSelectedContact(dummyContacts[0]);
      }
    } else {
      setContacts(dummyContacts);
      setSelectedContact(dummyContacts[0]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    const msg: Message = {
      id: Math.random().toString(),
      sender: "me",
      text: newMessage.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-300 bg-white flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b border-gray-300">
          Contacts
        </h2>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((c) => (
            <button
              key={c.id}
              className={`flex items-center gap-3 p-3 w-full text-left hover:bg-blue-100 transition ${
                selectedContact?.id === c.id ? "bg-blue-200 font-semibold" : ""
              }`}
              onClick={() => setSelectedContact(c)}
            >
              <User className="w-6 h-6 text-gray-600" />
              <div className="flex flex-col">
                <span>{c.name}</span>
                <small className="text-gray-500">{c.phone}</small>
              </div>
            </button>
          ))}
        </div>

        {/* Emergency section */}
        <div className="border-t border-gray-300 p-4 bg-red-50">
          <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </h3>
          {emergencyContacts.map((e) => (
            <div key={e.id} className="flex justify-between items-center mb-1">
              <a
                href={`tel:${e.phone}`}
                className="text-red-600 font-bold hover:underline"
              >
                <span>{e.name}</span>
              </a>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center border-b border-gray-300 p-4 bg-white">
          <User className="w-8 h-8 mr-3 text-gray-700" />
          <div>
            <h2 className="text-xl font-semibold">
              {selectedContact?.name || "Select a contact"}
            </h2>
            <p className="text-sm text-gray-500">{selectedContact?.phone}</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-20">No messages yet</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs mb-3 p-3 rounded-lg break-words ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white border border-gray-300"
              }`}
            >
              <p>{msg.text}</p>
              <small className="block text-right text-xs text-gray-200 mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-300 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!selectedContact}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !selectedContact}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default MessengerPage;
