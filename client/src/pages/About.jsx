import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100">
      {/* Hero */}
      <section className="container-custom">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-amber-100">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-amber-100 blur-2xl opacity-60" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-100 blur-2xl opacity-60" />

          <div className="px-6 py-12 md:px-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-amber-900">
                Caring For Your Mind, Every Day
              </h1>
              <p className="mt-4 text-amber-800/80 text-lg">
                MindCare connects you with trusted professionals and simple tools
                that make prioritizing mental wellbeing feel natural and supportive.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary">Get Started</Link>
                <Link to="/psychologists" className="btn-secondary">Talk to an Expert</Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-amber-700/80">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span>Private & secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span>Flexible appointments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                  <span>Expert guidance</span>
                </div>
              </div>
            </div>

            <div className="md:pl-8">
              <div className="aspect-square md:aspect-[4/3] rounded-xl border border-amber-100 bg-gradient-to-tr from-amber-50 via-white to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl">🧠</div>
                  <p className="mt-3 text-amber-800/80">Your wellbeing, beautifully supported</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Sessions Completed", value: "10k+" },
            { label: "Trusted Experts", value: "500+" },
            { label: "Satisfaction", value: "98%" },
            { label: "Availability", value: "24/7" },
          ].map((item) => (
            <div key={item.label} className="card text-center">
              <div className="text-3xl font-extrabold text-amber-900">{item.value}</div>
              <div className="mt-1 text-sm text-amber-700/80">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-amber-900">Our Mission</h2>
          <p className="mt-4 text-amber-800/80">
            At MindCare, our mission is to make mental health care accessible to everyone.
            We believe mental health is just as important as physical health, and every
            individual deserves access to quality care without barriers.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container-custom">
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "💛", title: "Compassion", desc: "We care about every user's wellbeing." },
            { icon: "🪴", title: "Accessibility", desc: "Care that welcomes everyone." },
            { icon: "🔒", title: "Confidentiality", desc: "Your privacy is our priority." },
            { icon: "⭐", title: "Excellence", desc: "High standards in all services." },
          ].map((v) => (
            <div key={v.title} className="card">
              <div className="text-3xl">{v.icon}</div>
              <h3 className="mt-3 font-bold text-amber-900">{v.title}</h3>
              <p className="mt-1 text-sm text-amber-700/80">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section className="container-custom">
        <h2 className="text-3xl font-bold text-center text-amber-900 mb-6">Why Choose MindCare?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold mb-2 text-amber-900">Vetted Professionals</h3>
            <p className="text-sm text-amber-700/80">
              All our psychologists and doctors are verified and have relevant credentials.
            </p>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2 text-amber-900">Flexible Scheduling</h3>
            <p className="text-sm text-amber-700/80">Book consultations at times that work best for you.</p>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2 text-amber-900">Secure Platform</h3>
            <p className="text-sm text-amber-700/80">Advanced encryption keeps your data confidential.</p>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2 text-amber-900">Easy to Use</h3>
            <p className="text-sm text-amber-700/80">Simple booking with an intuitive interface.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-6">How It Works</h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-amber-200" />
            <div className="space-y-6">
              {[
                { title: "Create your profile", desc: "Tell us about your goals and preferences." },
                { title: "Match with an expert", desc: "We connect you with a trusted professional." },
                { title: "Begin your journey", desc: "Attend sessions, track progress, feel supported." },
              ].map((s, idx) => (
                <div key={s.title} className="grid grid-cols-[24px_1fr] gap-4">
                  <div className="relative">
                    <div className="h-6 w-6 rounded-full bg-amber-400 border border-amber-300" />
                    <span className="absolute -left-1 -top-1 text-xs font-bold text-amber-900">{idx + 1}</span>
                  </div>
                  <div className="card">
                    <h3 className="font-bold text-amber-900">{s.title}</h3>
                    <p className="text-sm text-amber-700/80">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-custom">
        <div className="max-w-3xl mx-auto text-center card">
          <h3 className="text-2xl font-bold text-amber-900">Ready to put your mind first?</h3>
          <p className="mt-2 text-amber-700/80">Join thousands building healthier, happier routines with MindCare.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link to="/psychologists" className="btn-primary">Explore Services</Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
