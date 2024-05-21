// components/Footer.js

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start">
          <div className="w-full md:w-[20%] mb-8 ">
            <h3 className="text-lg font-bold mb-2">About Us</h3>
            <p>
              Our mission is to provide a fun and secure platform where everyone
              has a chance to win big. Join us in the exciting world of crypto
              lotteries today!
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-8">
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <p>123 Street Name, City, Country</p>
            <p>Email: info@example.com</p>
            <p>Phone: +123456789</p>
          </div>
          <div className="w-full md:w-1/4 mb-8">
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <div className="flex flex-col ">
              <a href="#" className="text-white mr-4 hover:text-gray-400">
                Twitter
              </a>
              <a href="#" className="text-white mr-4 hover:text-gray-400">
                Instagram
              </a>
              <a href="#" className="text-white hover:text-gray-400">
                Facebook
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/4 mb-8">
            <h3 className="text-lg font-bold mb-2">Newsletter</h3>
            <p>Subscribe to our newsletter for updates.</p>
            <form className="mt-2">
              <input
                type="email"
                placeholder="Your Email Address"
                className="bg-purple-800 text-white border border-transparent focus:outline-none focus:border-white rounded px-4 py-2 mt-1 w-full"
              />
              <button
                type="submit"
                className="bg-white text-purple-900 font-semibold py-2 px-4 rounded mt-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
