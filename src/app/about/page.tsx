export default function AboutPage() {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">About CryptoTrader Pro</h1>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              CryptoTrader Pro was founded with a simple mission: to make cryptocurrency trading accessible, 
              intuitive, and profitable for everyone. We believe in the transformative power of blockchain 
              technology and aim to provide the tools and insights needed to navigate this exciting market.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Our platform combines advanced trading features with AI-powered insights to help traders of all 
              experience levels make informed decisions and maximize their potential returns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Founded in 2023 by a team of blockchain enthusiasts and financial technology experts, 
                CryptoTrader Pro emerged from a shared frustration with existing trading platforms. 
                We saw a gap in the market for a platform that combined professional-grade trading tools 
                with user-friendly interfaces and AI-powered insights.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                After months of development and testing, we launched CryptoTrader Pro with a commitment 
                to continuous improvement and innovation. Today, we serve thousands of traders worldwide, 
                from beginners taking their first steps in crypto to seasoned professionals managing 
                substantial portfolios.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                <li>
                  <strong className="text-blue-600 dark:text-blue-400">Innovation:</strong> We continuously explore new technologies and methodologies to enhance our platform.
                </li>
                <li>
                  <strong className="text-blue-600 dark:text-blue-400">Transparency:</strong> We believe in clear, honest communication with our users about features, fees, and risks.
                </li>
                <li>
                  <strong className="text-blue-600 dark:text-blue-400">Security:</strong> We prioritize the security of user funds and data above all else.
                </li>
                <li>
                  <strong className="text-blue-600 dark:text-blue-400">Education:</strong> We are committed to helping our users understand the crypto market and make informed decisions.
                </li>
                <li>
                  <strong className="text-blue-600 dark:text-blue-400">Community:</strong> We value the feedback and contributions of our user community in shaping our platform.
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md mb-12">
            <h2 className="text-2xl font-bold mb-6">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Jane Doe</h3>
                <p className="text-gray-600 dark:text-gray-400">CEO & Co-Founder</p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  Former fintech executive with 15+ years of experience in blockchain and financial markets.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">John Smith</h3>
                <p className="text-gray-600 dark:text-gray-400">CTO & Co-Founder</p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  Blockchain developer and architect with experience building high-frequency trading systems.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Emily Chen</h3>
                <p className="text-gray-600 dark:text-gray-400">Head of AI Research</p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  PhD in Machine Learning with expertise in predictive analytics and natural language processing.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-600 dark:bg-blue-800 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Join Us on Our Journey</h2>
            <p className="mb-6 max-w-3xl mx-auto">
              {`We're just getting started, and we invite you to join us on our mission to revolutionize cryptocurrency trading. 
              Whether you're a seasoned trader or just curious about crypto, CryptoTrader Pro has something for you.`}
            </p>
            <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">
              Start Trading Now
            </button>
          </div>
        </div>
      </div>
    );
  }
  