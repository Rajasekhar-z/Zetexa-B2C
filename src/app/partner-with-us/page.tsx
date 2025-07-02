export default function PartnerWithUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Partner With Us</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Become a Zetexa Partner</h2>
          
          <p className="text-gray-600 mb-6">
            Join our network of partners and help travelers stay connected worldwide. Whether you're a travel agency, 
            hotel, or business looking to offer eSIM solutions, we'd love to work with you.
          </p>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your company name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Tell us about your business and how you'd like to partner"
                required
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Partnership Request
            </button>
          </form>
        </div>

        <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Why Partner With Us?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Competitive Commission</h3>
              <p className="text-gray-600">Earn attractive commissions on every eSIM sale through your partnership.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Global Coverage</h3>
              <p className="text-gray-600">Offer your customers connectivity in multiple countries worldwide.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Easy Integration</h3>
              <p className="text-gray-600">Simple API integration and support for seamless implementation.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Dedicated Support</h3>
              <p className="text-gray-600">Get priority support and resources to help grow your business.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
