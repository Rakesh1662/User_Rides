
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Users, 
  Car, 
  Shield, 
  Award,
  Send,
  CheckCircle,
  Heart,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_queries')
        .insert([formData]);

      if (dbError) throw dbError;

      // Send email
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw error for email failure, just log it
      }

      toast.success('Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Car className="h-8 w-8 text-accent" />,
      title: "Wide Vehicle Selection",
      description: "Choose from 20+ different types of cars and bikes"
    },
    {
      icon: <Shield className="h-8 w-8 text-accent" />,
      title: "Fully Insured",
      description: "All vehicles are comprehensively insured for your safety"
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "Best Prices",
      description: "Competitive pricing starting from just ₹750/day"
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs"
    }
  ];

  const stats = [
    { number: "5000+", label: "Happy Customers", icon: <Users className="h-6 w-6" /> },
    { number: "50+", label: "Vehicles", icon: <Car className="h-6 w-6" /> },
    { number: "4.8", label: "Average Rating", icon: <Star className="h-6 w-6" /> },
    { number: "24/7", label: "Support", icon: <CheckCircle className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-steel text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About <span className="text-accent">User Rides</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Your trusted vehicle rental partner in Hyderabad, providing quality vehicles 
              and exceptional service since 2020.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-from-bottom" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4 text-accent">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-navy mb-2">{stat.number}</div>
                  <div className="text-steel">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-from-left">
              <h2 className="text-3xl font-bold text-navy mb-6">Our Story</h2>
              <p className="text-steel text-lg mb-6">
                Founded in 2020, User Rides began with a simple mission: to make vehicle rentals 
                accessible, affordable, and reliable for everyone in Hyderabad. What started as a 
                small venture with just 5 vehicles has grown into the city's most trusted rental service.
              </p>
              <p className="text-steel text-lg mb-6">
                We understand that mobility is freedom. Whether you need a bike for your daily commute, 
                a car for a family trip, or a luxury vehicle for a special occasion, we've got you covered 
                with our diverse fleet and customer-first approach.
              </p>
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-steel">Made with love in Hyderabad</span>
              </div>
            </div>
            <div className="animate-slide-in-from-right">
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center"
                alt="User Rides Fleet"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-navy mb-4">Why Choose User Rides?</h2>
            <p className="text-steel text-lg">We're committed to providing the best rental experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-from-bottom" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">{feature.title}</h3>
                  <p className="text-steel">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="animate-slide-in-from-left">
              <h2 className="text-3xl font-bold text-navy mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-accent mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Our Location</h3>
                    <p className="text-steel">
                      Kukatpally, Hyderabad<br />
                      Telangana, India - 500085
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-accent mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Email Us</h3>
                    <p className="text-steel">rakeshsandagonda@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-accent mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Call Us</h3>
                    <p className="text-steel">+91 12345 67890</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-accent mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Working Hours</h3>
                    <p className="text-steel">
                      Monday - Sunday: 24/7<br />
                      Customer Support Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Pickup Locations */}
              <div className="mt-8">
                <h3 className="font-semibold text-navy mb-4">Pickup Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {['Hyderabad City Center', 'Secunderabad', 'Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally', 'Ameerpet'].map((location) => (
                    <Badge key={location} variant="outline" className="text-accent border-accent">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slide-in-from-right">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                          Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                          Email *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                          Phone
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 12345 67890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                          Subject *
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Tell us more about your query..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
