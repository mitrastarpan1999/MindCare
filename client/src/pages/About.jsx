export default function About() {
  return (
    <div className="container-custom">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About MindCare</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At MindCare, our mission is to make mental health care accessible to everyone. We believe that
            mental health is just as important as physical health, and every individual deserves access to
            quality mental health services without barriers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Who We Are</h2>
          <p className="text-gray-700 mb-4">
            MindCare is a platform dedicated to connecting patients with experienced and qualified mental
            health professionals. Our team consists of experts in psychology, psychiatry, and healthcare
            technology who are passionate about improving mental health outcomes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Our Values</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Compassion:</strong> We care about our users' wellbeing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Accessibility:</strong> Mental health care should be available to all</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Confidentiality:</strong> Your privacy is our priority</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Excellence:</strong> We maintain high standards in all services</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">Why Choose MindCare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold mb-2">Vetted Professionals</h3>
              <p className="text-sm text-gray-600">
                All our psychologists and doctors are verified and have relevant credentials
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Flexible Scheduling</h3>
              <p className="text-sm text-gray-600">
                Book consultations at times that work best for you
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Secure Platform</h3>
              <p className="text-sm text-gray-600">
                Advanced encryption ensures all your data remains confidential
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold mb-2">Easy to Use</h3>
              <p className="text-sm text-gray-600">
                Simple booking process and intuitive user interface
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
