import { Inquiry } from "../types/travel";

export const mockStaff = [
  "Mashrafe Elahi",
  "Sarah Jenkins",
  "David Chen",
  "Elena Rostova"
];

export const mockInquiries: Inquiry[] = [
  {
    id: "inq-1",
    customerName: "Liam Neeson",
    email: "liam.neeson@action.com",
    phone: "+1 (555) 987-1234",
    interestedPackage: "Serengeti Wildlife Safari",
    destination: "Serengeti National Park, Tanzania",
    message: "I am planning a family trip. Can you provide information on the safety precautions and if there are private luxury lodges available? Also, I would like to know the best time of year to see the great migration.",
    date: "2026-07-01",
    status: "New"
  },
  {
    id: "inq-2",
    customerName: "Sophia Loren",
    email: "sophia.loren@cinema.it",
    phone: "+39 02 1234567",
    interestedPackage: "Rome Historical Journey",
    destination: "Rome, Italy",
    message: "Hello! I am interested in a customized historical tour in Rome, focusing on private art collections and VIP entry to the Vatican. Could you arrange a dedicated historian guide for our group?",
    date: "2026-07-03",
    status: "Contacted",
    assignedStaff: "Sarah Jenkins"
  },
  {
    id: "inq-3",
    customerName: "Bruce Wayne",
    email: "bruce@waynecorp.com",
    phone: "+1 (555) 000-0099",
    interestedPackage: "Swiss Alps Adventure",
    destination: "Zermatt, Switzerland",
    message: "Looking for high-altitude trekking and off-piste heli-skiing options in Zermatt. Budget is not an issue, but privacy and top-tier gear rentals are paramount. Please get back to me with a custom package.",
    date: "2026-07-04",
    status: "Follow-up",
    assignedStaff: "David Chen"
  },
  {
    id: "inq-4",
    customerName: "Emma Watson",
    email: "emma.watson@books.org",
    phone: "+44 20 7946 0958",
    interestedPackage: "Ancient Kyoto Explorer",
    destination: "Kyoto, Japan",
    message: "Hello! I am planning a sustainable, eco-friendly trip to Kyoto. I would like to visit ancient temples, participate in traditional tea ceremonies, and stay in authentic, locally-owned ryokans. Do your itineraries cover these?",
    date: "2026-07-05",
    status: "Converted",
    assignedStaff: "Elena Rostova"
  },
  {
    id: "inq-5",
    customerName: "Tony Stark",
    email: "tony@starkindustries.com",
    phone: "+1 (555) 300-3000",
    interestedPackage: "Manhattan Sky-High Experience",
    destination: "New York, USA",
    message: "Hey, I need a luxury penthouse booked for next weekend with exclusive access to the highest observation decks. Plus, a helicopter transfer from JFK. Can your team pull this off on short notice?",
    date: "2026-07-07",
    status: "New",
    assignedStaff: "Mashrafe Elahi"
  },
  {
    id: "inq-6",
    customerName: "Peter Parker",
    email: "peter.parker@dailybugle.com",
    phone: "+1 (555) 111-2222",
    interestedPackage: "Tropical Paradise Getaway",
    destination: "Bali, Indonesia",
    message: "Hi, I am looking for a budget-friendly beach package for a student vacation. Do you offer student discounts or group rates for Bali? I'd also love to know if surfing lessons are included.",
    date: "2026-07-08",
    status: "Closed",
    assignedStaff: "David Chen"
  },
  {
    id: "inq-7",
    customerName: "Selina Kyle",
    email: "selina.kyle@catwalk.com",
    phone: "+1 (555) 777-8888",
    interestedPackage: "Santorini Sunset Retreat",
    destination: "Santorini, Greece",
    message: "I am interested in the Santorini retreat. Do you have villas with private infinity pools and high security? I prefer a quiet location away from the main tourist crowds.",
    date: "2026-07-08",
    status: "Follow-up",
    assignedStaff: "Sarah Jenkins"
  }
];
