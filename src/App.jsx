import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";

import WhyChooseUs from "./components/WhyChooseUs";
import Gallery from "./components/Gallery";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Projects from "./components/Project";

import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";

import AddCollection from "./admin/Collection/AddCollection";
import CollectionList from "./admin/Collection/CollectionList";
import EditCollection from "./admin/Collection/EditCollection";

import EditService from "./admin/Services/EditService";
import AddService from "./admin/Services/AddService";
import ServiceList from "./admin/Services/ServiceList";

import TestimonialList from "./admin/Testimonial/TestimonialList";
import AddTestimonial from "./admin/Testimonial/AddTestimonial";
import EditTestimonial from "./admin/Testimonial/EditTestimonial";

import EditHero from "./admin/Hero/EditHero";
import HeroList from "./admin/Hero/HeroList";
import AddHero from "./admin/Hero/AddHero";

import AddAbout from "./admin/About/AddAbout";
import EditAbout from "./admin/About/EditAbout";
import AboutList from "./admin/About/AboutList";

import AddProject from "./admin/Project/AddProject";
import ProjectEdit from "./admin/Project/EditProject";
import ProjectList from "./admin/Project/ProjectList";

import GalleryList from "./admin/Gallery/GalleryList";
import GalleryAdd from "./admin/Gallery/GalleryAdd";
import GalleryEdit from "./admin/Gallery/GalleryEdit";
import Collection from "./components/Collection";
import RoomPreview from "./components/RoomPreview";

export default function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <Routes>

        {/* Public Website */}
        <Route
          path="/"
          element={
            <>
              <Navbar />

              <section id="home"><Hero /></section>
              <section id="about"><About /></section>
              <section id="collection"><Collection /></section>
              <section id="whychooseus"><WhyChooseUs /></section>
              <section id="gallery"><Gallery /></section>
              <section id="services"><Services /></section>
              <section id="projects"><Projects/></section>
              <section id="testimonials"><Testimonials /></section>
              <section id="contact"><ContactForm /></section>

              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* Hero */}
        <Route path="/admin/hero" element={<HeroList />} />
        <Route path="/admin/hero/add" element={<AddHero />} />
        <Route path="/admin/hero/edit/:id" element={<EditHero />} />

        {/* About */}
        <Route path="/admin/about" element={<AboutList />} />
        <Route path="/admin/about/add" element={<AddAbout />} />
        <Route path="/admin/about/edit/:id" element={<EditAbout />} />

        {/* Gallery */}
        <Route path="/admin/gallery" element={<GalleryList />} />
        <Route path="/admin/gallery/add" element={<GalleryAdd />} />
        <Route path="/admin/gallery/edit/:id" element={<GalleryEdit />} />
       <Route path="/room-preview" element={<RoomPreview />} />


       {/*Collection */}
       <Route path="/admin/collection" element={<CollectionList />} />
        <Route path="/admin/collection/add" element={<AddCollection />} />
        <Route path="/admin/collection/edit/:id" element={<EditCollection />} />

        {/* Services */}
        <Route path="/admin/services" element={<ServiceList />} />
        <Route path="/admin/services/add" element={<AddService />} />
        <Route path="/admin/services/edit/:id" element={<EditService />} />

        {/* Testimonials */}
        <Route path="/admin/testimonials" element={<TestimonialList />} />
        <Route path="/admin/testimonials/add" element={<AddTestimonial />} />
        <Route path="/admin/testimonials/edit/:id" element={<EditTestimonial />} />

        {/* Projects */}
        <Route path="/admin/projects" element={<ProjectList />} />
        <Route path="/admin/projects/add" element={<AddProject />} />
        <Route path="/admin/projects/edit/:id" element={<ProjectEdit />} />

      </Routes>
    </div>
  );
}
