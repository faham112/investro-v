import { Card, CardContent } from "@/components/ui/card";

const investors = [
  {
    id: 1,
    name: "Bradon Crithia",
    position: "Founder",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400"
  },
  {
    id: 2,
    name: "John Crista",
    position: "Manager of Company",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400"
  },
  {
    id: 3,
    name: "Shiraj Mehtab",
    position: "Developer of IT",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400"
  },
  {
    id: 4,
    name: "Anup Samonta",
    position: "Creative Head",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400"
  }
];

export default function TeamSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-orange-500 text-sm font-semibold mb-4 uppercase tracking-wide">
            Top Investors
          </p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Investors</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Various aliquet nulla quibusdam eu odio natus wisi eget, lectus Nam consequuntur urna lectus commodo laboriosam Ridiculus lectus laboriosam.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {investors.map((investor) => (
            <Card 
              key={investor.id}
              className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-0">
                <img
                  src={investor.avatar}
                  alt={investor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {investor.name}
                </h3>
                <p className="text-gray-600">{investor.position}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
