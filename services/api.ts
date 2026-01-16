import { User, Notice } from '../types';

// --- MOCK DATABASE (This would be replaced by Supabase/Firebase calls) ---

export interface Associate {
  id: number;
  name: string;
  email: string;
  image: string;
  whatsapp?: string;
  position?: string;
}

const MOCK_ASSOCIATES: Associate[] = [
  { id: 1, name: "Alessandra Vianna", position: "Senior Travel Consultant", email: "alessandra.v@traveliz.com", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", whatsapp: "123456789" },
  { id: 2, name: "Julianne Moore", position: "Luxury Travel Specialist", email: "j.moore@traveliz.com", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop", whatsapp: "987654321" },
  { id: 3, name: "Elena Rodriguez", position: "Destination Manager", email: "e.rodriguez@traveliz.com", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop", whatsapp: "1122334455" },
  { id: 4, name: "Marco Rossi", position: "Corporate Accounts", email: "marco.r@traveliz.com", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", whatsapp: "5544332211" },
  { id: 5, name: "Sarah Jenkins", position: "Operations Lead", email: "s.jenkins@traveliz.com", image: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f43?q=80&w=800&auto=format&fit=crop", whatsapp: "6677889900" },
  { id: 6, name: "David Chen", position: "Asia Pacific Specialist", email: "d.chen@traveliz.com", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop", whatsapp: "3344556677" },
  { id: 7, name: "Isabella Garcia", position: "Events Coordinator", email: "i.garcia@traveliz.com", image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=800&auto=format&fit=crop", whatsapp: "111222333" },
  { id: 8, name: "Michael Thompson", position: "Cruise Expert", email: "m.thompson@traveliz.com", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop", whatsapp: "444555666" },
  { id: 9, name: "Emily Watson", position: "European Tours", email: "e.watson@traveliz.com", image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?q=80&w=800&auto=format&fit=crop", whatsapp: "777888999" },
  { id: 10, name: "Lucas Mendes", position: "South America Lead", email: "l.mendes@traveliz.com", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop", whatsapp: "000111222" },
  { id: 11, name: "Sophia Li", position: "Concierge Services", email: "s.li@traveliz.com", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", whatsapp: "333444555" },
  { id: 12, name: "Robert Fox", position: "Business Development", email: "r.fox@traveliz.com", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", whatsapp: "666777888" },
  { id: 13, name: "Olivia Brown", position: "Marketing Manager", email: "o.brown@traveliz.com", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop", whatsapp: "999000111" },
  { id: 14, name: "James Wilson", position: "Tech Support", email: "j.wilson@traveliz.com", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=800&auto=format&fit=crop", whatsapp: "222333444" },
  { id: 15, name: "Ava Martin", position: "Customer Success", email: "a.martin@traveliz.com", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop", whatsapp: "555666777" },
  { id: 16, name: "William Clark", position: "Finance Director", email: "w.clark@traveliz.com", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop", whatsapp: "888999000" },
  { id: 17, name: "Mia Anderson", position: "HR Specialist", email: "m.anderson@traveliz.com", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop", whatsapp: "123123123" },
  { id: 18, name: "Benjamin Wright", position: "Legal Counsel", email: "b.wright@traveliz.com", image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=800&auto=format&fit=crop", whatsapp: "456456456" },
  { id: 19, name: "Charlotte Scott", position: "Training Manager", email: "c.scott@traveliz.com", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop", whatsapp: "789789789" },
  { id: 20, name: "Henry Green", position: "Sustainability Officer", email: "h.green@traveliz.com", image: "https://images.unsplash.com/photo-1522075469751-3a3694c60e9e?q=80&w=800&auto=format&fit=crop", whatsapp: "321321321" },
  { id: 21, name: "Amelia Baker", position: "Wellness Travel", email: "a.baker@traveliz.com", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop", whatsapp: "654654654" },
  { id: 22, name: "Daniel Carter", position: "Adventure Travel", email: "d.carter@traveliz.com", image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=800&auto=format&fit=crop", whatsapp: "987987987" },
  { id: 23, name: "Grace Hill", position: "Family Travel", email: "g.hill@traveliz.com", image: "https://images.unsplash.com/photo-1534751516054-0db5b131f561?q=80&w=800&auto=format&fit=crop", whatsapp: "147147147" },
  { id: 24, name: "Alexander King", position: "Golf Specialist", email: "a.king@traveliz.com", image: "https://images.unsplash.com/photo-1521119989659-a83eee488058?q=80&w=800&auto=format&fit=crop", whatsapp: "258258258" },
  { id: 25, name: "Ella Nelson", position: "Honeymoon Planner", email: "e.nelson@traveliz.com", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop", whatsapp: "369369369" }
];

// --- SERVICE LAYER ---

export const api = {
  // Simulate fetching associates from a DB with latency
  getAssociates: async (): Promise<Associate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ASSOCIATES);
      }, 1200); // 1.2s simulated network delay
    });
  },

  // You can add more methods here later
  // getEvents: async () => { ... }
};