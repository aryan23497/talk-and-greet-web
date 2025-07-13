import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, Zap, Shield, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-robot.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ChatAI</span>
          </div>
          <Link to="/chatbot">
            <Button variant="outline" className="bg-background/10 border-border/20 text-foreground hover:bg-background/20">
              Try Chat
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              The Future of
              <br />
              Conversation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the next generation of AI chat technology. Intelligent, intuitive, and infinitely helpful.
            </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chatbot">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 py-3 shadow-glow">
                Start Chatting
                <MessageCircle className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/legal-chatbot">
              <Button size="lg" variant="outline" className="bg-background/10 border-border/20 text-foreground hover:bg-background/20">
                <Scale className="mr-2 w-5 h-5" />
                Legal AI Assistant
              </Button>
            </Link>
          </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="relative mx-auto max-w-4xl">
              <img 
                src={heroImage} 
                alt="AI Chatbot Interface" 
                className="w-full rounded-2xl shadow-elegant border border-border/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Powered by Advanced AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge technology delivers human-like conversations with unprecedented accuracy and understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-xl p-8 border border-border/20 shadow-elegant">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Intelligent Responses</h3>
              <p className="text-muted-foreground">
                Get contextually aware answers that understand nuance and provide meaningful insights for every query.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border/20 shadow-elegant">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Experience instant responses with our optimized AI infrastructure designed for speed and reliability.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border/20 shadow-elegant">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Indian Legal AI</h3>
              <p className="text-muted-foreground">
                Access comprehensive Indian legal information including case law, statutes, and legal advice powered by IndianKanoon.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border/20 shadow-elegant">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your conversations are protected with enterprise-grade security and privacy-first design principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-secondary rounded-2xl p-12 border border-border/20 shadow-elegant">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Experience the Future?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who are already having amazing conversations with our AI.
            </p>
            <Link to="/chatbot">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 py-3 shadow-glow">
                Start Your First Chat
                <MessageCircle className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 ChatAI. Built with cutting-edge technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
