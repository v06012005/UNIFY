'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import TectNetwork from '@/public/images/tech_network.png';
import DataSecurity from '@/public/images/data_security.png';
import Community from '@/public/images/community.png';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 0, 0);


    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 10, 7.5);
    directional.castShadow = true;
    scene.add(directional);

    
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.7, roughness: 0.2 });
    const torus = new THREE.Mesh(geometry, material);
    torus.castShadow = true;
    torus.receiveShadow = true;
    torus.position.set(0, 0, 0);
    scene.add(torus);

   
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.2 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    
    const particleCount = 200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x4f46e5,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;

    let animationFrameId;
    let lastInteraction = Date.now();
    function animate() {
      const now = Date.now();
      if (now - lastInteraction > 2000) {
        torus.rotation.x += 0.005;
        torus.rotation.y += 0.005;
      }
      particles.rotation.y += 0.002;
      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    
    const onInteraction = () => {
      lastInteraction = Date.now();
    };
    canvas.addEventListener('mousedown', onInteraction);
    canvas.addEventListener('touchstart', onInteraction);


    gsap.fromTo(
      '.title',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 }
    );
    gsap.fromTo(
      '.subtitle',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.7 }
    );
    gsap.fromTo(
      '.buttons',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power2.out', delay: 0.9 }
    );

    const handleScroll = () => {
      const sections = document.querySelectorAll('.terms-section');
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: index * 0.3,
          });
        } else {
          gsap.to(section, {
            opacity: 0,
            y: 20,
            scale: 0.95,
            rotate: 2,
            duration: 0.8,
            ease: 'power2.out',
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

   
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

   
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      canvas.removeEventListener('mousedown', onInteraction);
      canvas.removeEventListener('touchstart', onInteraction);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);




  return (
    <div ref={contentRef} className="relative w-full bg-gradient-to-b from-gray-900 to-indigo-900 overflow-y-auto no-scrollbar scroll-smooth overflow-x-hidden">
      
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-screen" />

      
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center text-white px-4">
        <h1 className="title text-5xl font-bold mb-4">Welcome to Unify</h1>
        <p className="subtitle text-lg mb-8 max-w-2xl">
          Connect, share, and grow with our community-driven platform.
        </p>
        <div className="buttons flex gap-4">
          <button onClick={() => router.push('/register')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105">
            Get Started
          </button>
          <button className="px-6 py-3 bg-white text-indigo-600 hover:bg-gray-100 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>

     
      <div className="relative z-10 w-full py-12">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="terms-section terms-card flex flex-col md:flex-row items-center mb-12 p-6 opacity-0 translate-y-20 scale-95 rotate-2">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6 text-white">
              <h2 className="text-2xl font-bold mb-4 terms-heading">Terms of Service</h2>
              <p className="mb-4">
                Workaholics creates technologies and services to help people connect with each other, build communities, and grow businesses. These Terms of Service ("Terms") govern your access to and use of Unify, as well as other products, websites, features, applications, services, technologies, and software we offer (collectively, the "Products"), unless we explicitly state that separate terms apply (and these Terms do not). These Products are provided to you by Workaholics. These Terms constitute an agreement between you and Workaholics. If you do not agree to these Terms, please do not access or use Unify or any other products and services covered by these Terms.
              </p>
              <p className="mb-4">
                These Terms constitute the entire agreement between you and Workaholics regarding your use of our Products. These Terms supersede any prior agreements.
              </p>
              <p className="mb-4">
                You do not incur fees for using Unify or other products and services covered by these Terms, unless otherwise specified by us. By using our Products, you agree to allow us to display advertisements that we believe may be relevant to you and your interests. We use your personal data to determine which personalized advertisements to show you.
              </p>
              <p className="mb-4">
                We do not sell your personal data to advertisers, nor do we share information that directly identifies you (such as your name, email address, or other contact information) with these entities, unless you explicitly grant permission. Instead, advertisers may provide us with information about the type of audience they want to target, and we display those ads to people who might be interested. We provide advertisers with performance metrics to help them understand how people interact with their content.
              </p>
            </div>
            <img
              src={TectNetwork.src}
              alt="Tech Network"
              className="md:w-1/2 h-96 object-cover terms-image"
            />
          </div>
          <div className="divider mb-12"></div>

          
          <div className="terms-section terms-card flex flex-col md:flex-row-reverse items-center mb-12 p-6 opacity-0 translate-y-20 scale-95 rotate-2">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pl-6 text-white">
              <h2 className="text-2xl font-bold mb-4 terms-heading">Privacy Policy</h2>
              <p className="mb-4">
                Workaholics wants you to understand the types of information we collect, as well as how we use and share that information. Therefore, you should read our Privacy Policy. This will help you use our services in a way that suits you.
              </p>
              <p className="mb-4">
                The Privacy Policy explains how we collect, use, share, store, and transfer information. We also inform you about your rights. Each section of the Policy includes helpful examples and uses simpler language to make our practices easier to understand. Additionally, we’ve included links to resources and information so you can learn more about privacy topics that interest you.
              </p>
              <p className="mb-4">
                We believe you should have control over your privacy. Therefore, we also show you where you can manage your information in the settings of the Workaholics Products you use. You can shape your experience accordingly.
              </p>
            </div>
            <img
              src={DataSecurity.src}
              alt="Data Security"
              className="md:w-1/2 h-96 object-cover terms-image"
            />
          </div>
          <div className="divider mb-12"></div>

          
          <div className="terms-section terms-card flex flex-col md:flex-row items-center mb-12 p-6 opacity-0 translate-y-">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6 text-white">
              <h2 className="text-2xl font-bold mb-4 terms-heading">Community Standards</h2>
              <p className="mb-4">
                Every day, people use Unify to share experiences and lessons, connect with family and friends, and build communities. Our services enable people to freely express themselves, their knowledge, and their experiences.
              </p>
              <p className="mb-4">
                At the same time, we are serious about our role in preventing abusive behavior on our services. That’s why we establish standards outlining what content is allowed and not allowed on these services.
              </p>
              <p className="mb-4">
                These standards are based on feedback from people, as well as advice from experts in fields such as technology, public safety, and human rights. To ensure everyone’s voice is valued, we strive to create standards that encompass diverse perspectives and beliefs, especially those of marginalized or overlooked individuals and communities.
              </p>
              <h3 className="text-xl font-semibold mb-2 text-white">Community Standards</h3>
              <p className="mb-4">
                Our Community Standards apply to everyone worldwide and to all types of content, including AI-generated content.
              </p>
              <p className="mb-4">
                Each section of our Community Standards begins with a "Reason for the Policy." This outlines the policy’s objectives, followed by specific policy details stating:
              </p>
              <ul className="list-disc pl-6 mb-4 text-white">
                <li>Content that is not allowed, content that requires additional information or context to enforce the policy, content that is allowed with a warning screen, or content that is allowed but only shown to adults aged 18 and older.</li>
              </ul>
              <ul className="list-disc pl-6 mb-4 text-white">
                <li>Coordinated Harm and Promotion of Crime</li>
                <li>Dangerous Individuals and Organizations</li>
                <li>Fraud, Scams, and Deception</li>
                <li>Violence and Incitement</li>
                <li>Adult Sexual Exploitation</li>
                <li>Bullying and Harassment</li>
                <li>Child Nudity, Abuse, and Sexual Exploitation</li>
                <li>Human Exploitation</li>
                <li>Suicide, Self-Harm, and Eating Disorders</li>
                <li>Adult Sexual Activities and Nudity</li>
                <li>Adult Sexual Solicitation and Pornographic Language</li>
                <li>Hateful Conduct</li>
                <li>Privacy Violations</li>
                <li>Violent and Graphic Content</li>
                <li>Account Integrity</li>
                <li>Commitment to Authentic Identity</li>
                <li>Cybersecurity</li>
                <li>Deceptive Behavior</li>
                <li>Memorialization</li>
                <li>Misinformation</li>
                <li>Spam</li>
                <li>Third-Party Intellectual Property Infringement</li>
                <li>Use of Workaholics’ Licenses and Intellectual Property</li>
                <li>Additional Protections for Minors</li>
                <li>Content, Products, or Services Violating Local Laws</li>
              </ul>
            </div>
            <img
              src={Community.src}
              alt="Community"
              className="md:w-1/2 h-96 object-cover terms-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}