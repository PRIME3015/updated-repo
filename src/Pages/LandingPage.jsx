import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import companies from "../data/companies.json";
import faq from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";

const LandingPage = () => {
  const [showFAQ, setShowFAQ] = useState(false);

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  return (
    <main className="flex flex-col gap-16 sm:gap-24 py-10 sm:py-20 px-5 sm:px-10 bg-gradient-to-r from-blue-50 via-green-50 to-purple-50">
      {/* Title and Description */}
      <section className="text-center px-6">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-tight text-gray-800">
          Find your dream{" "}
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
            job with us
          </span>
        </h1>
        <p className="text-lg sm:text-xl mt-4 text-gray-600 max-w-2xl mx-auto">
          Discover your next career opportunity with us. Whether you're looking
          for a job or posting a new one, we are here to help.
        </p>
      </section>

      {/* Find Jobs and Post Jobs Buttons */}
      <div className="flex justify-center gap-8 mt-10">
        <Link to="/JobListing">
          <Button
            size="xl"
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-all duration-300"
          >
            Find Jobs
          </Button>
        </Link>

        <Link to="/PostJobs">
          <Button
            variant="destructive"
            size="xl"
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300"
          >
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Carousel */}
      <div className="mt-16">
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full py-10"
        >
          <CarouselContent className="flex gap-12 justify-center items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="flex-shrink-0">
                <img
                  src={path}
                  alt={name}
                  className="h-12 sm:h-16 object-contain hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Resources Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 px-6">
        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Data Structure and Algorithm /Competetive programming Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Prepare for your next interview with these expert tips and guides.
            </p>
            <Link
              to="https://asksenior.in/"
              target="_blank"
              className="text-blue-600 hover:underline mt-4 block"
            >
              Learn More
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Resume Building
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Build a compelling resume with these tools and templates.
            </p>
            <Link
              to="https://www.example.com/resume-tools"
              target="_blank"
              className="text-blue-600 hover:underline mt-4 block"
            >
              Explore Tools
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Job Search Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Maximize your job search with proven strategies and insights.
            </p>
            <Link
              to="https://www.example.com/job-search-strategies"
              target="_blank"
              className="text-blue-600 hover:underline mt-4 block"
            >
              Get Started
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section Toggle */}
      <div className="text-center mt-10">
        <Button
          onClick={toggleFAQ}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all duration-300"
        >
          {showFAQ ? "Hide FAQ" : "Show FAQ"}
        </Button>
      </div>

      {/* Accordion for FAQs */}
      {showFAQ && (
        <section className="mt-10">
          <Accordion type="single" collapsible>
            {faq.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-lg sm:text-xl font-medium hover:bg-purple-200 transition-all duration-300 p-4 rounded-md">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="p-4 text-gray-700 bg-gray-50 rounded-b-md">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
    </main>
  );
};

export default LandingPage;
