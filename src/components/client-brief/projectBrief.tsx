// src/components/ProjectBrief.tsx
// cspell:disable
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

// ---------------------
// Interface Definitions
// ---------------------
interface Developer {
  name: string;
  role: string;
  specialization: string;
}

interface Client {
  companyName: string;
  businessType: string;
  services: string[];
}

interface ProjectUnderstanding {
  currentNeeds: string[];
  mainGoals: string[];
  businessContext: string;
}

interface CoreFeature {
  title: string;
  description: string;
  technicalDetails: string;
  businessBenefit: string;
}

interface DevelopmentSolution {
  coreFeatures: CoreFeature[];
  businessBenefits: string[];
  optionalFeatures: string[];
}

interface TimelinePhase {
  phase: string;
  duration: string;
  deliverables: string[];
  milestones: string[];
}

interface Implementation {
  timeline: TimelinePhase[];
  totalDuration: string;
}

interface PaymentScheduleItem {
  percentage: number;
  amount: number;
  milestone: string;
}

interface MaintenancePlan {
  price: string;
  name: string;
  features: string[];
}

interface MaintenancePlans {
  basic: MaintenancePlan;
  standard: MaintenancePlan;
  premium: MaintenancePlan;
}

interface Investment {
  totalCost: number;
  paymentSchedule: PaymentScheduleItem[];
  packageIncludes: string[];
  support: {
    duration: string;
    includes: string[];
  };
  maintenancePlans: MaintenancePlans;
}

interface ClientRequirements {
  requiredInputs: string[];
  approvalTimelines: string[];
  technicalAccess: string[];
}

interface NextSteps {
  immediateActions: string[];
  timeline: string;
  callToAction: {
    heading: string;
    description: string;
  };
}

interface ProjectData {
  developer: Developer;
  client: Client;
  projectUnderstanding: ProjectUnderstanding;
  developmentSolution: DevelopmentSolution;
  implementation: Implementation;
  investment: Investment;
  clientRequirements: ClientRequirements;
  nextSteps: NextSteps;
}

interface ProjectBriefProps {
  data: ProjectData;
}

const ProjectBrief: React.FC<ProjectBriefProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    console.log("Project Data Received:", data);
  }, [data]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    // Main container with gradient background
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Noise overlay */}
      <div className="min-h-screen backdrop-blur-[1px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)]">
        {/* Title Slide */}
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-lg shadow-lg overflow-hidden">
            <div className="backdrop-blur-sm bg-white/5 p-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
                {`${data.client.companyName} Web Development`}
              </h1>
              <div className="text-xl mb-4 text-white/90">
                {data.client.businessType}
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="text-sm text-white/80 mb-2">
                  Lead Developer &amp; Designer
                </div>
                <div className="text-white">{data.developer.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mx-auto max-w-4xl p-6 md:p-8 my-4 md:my-8">
          <div className="backdrop-blur-md bg-white/80 rounded-lg shadow-lg overflow-hidden transition-all duration-600">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-cyan-600 drop-shadow-sm">
                Project Overview
              </h2>
              <div className="bg-cyan-50/50 backdrop-blur-sm p-6 rounded-lg mb-6 hover:bg-cyan-50/70 transition-all duration-300 border border-cyan-100/50">
                <p className="text-gray-700">
                  {data.projectUnderstanding.businessContext}
                </p>
              </div>
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={"/images/brief/cleaning-show.jpg"}
                  alt="Project Visualization"
                  fill
                  className="object-cover rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Needs Section */}
        <div className="mx-auto max-w-4xl p-6 md:p-8 my-4 md:my-8">
          <div className="backdrop-blur-md bg-white/80 rounded-lg shadow-lg overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-600">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-600 drop-shadow-sm">
                Current Needs
              </h2>
              <div className="space-y-3 mb-8">
                {data.projectUnderstanding.currentNeeds.map((need, index) => (
                  <div
                    key={index}
                    className="pl-4 border-l-2 border-cyan-400/50 hover:border-cyan-500 hover:pl-6 transition-all duration-300 text-gray-700 backdrop-blur-sm bg-cyan-50/30 p-3 rounded-r-lg"
                  >
                    {need}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Development Solution */}
        <div className="mx-auto max-w-4xl p-6 md:p-8 my-4 md:my-8">
          <div className="backdrop-blur-md bg-white/80 rounded-lg shadow-lg overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-600">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-600 drop-shadow-sm">
                Development Solution
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.developmentSolution.coreFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="group backdrop-blur-sm bg-cyan-50/50 rounded-lg border border-cyan-100/50 hover:bg-cyan-50/70 transition-all duration-300"
                  >
                    <div className="p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <h3 className="text-xl font-bold mb-3 text-cyan-600 relative z-10">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 relative z-10 mb-3">
                        {feature.description}
                      </p>
                      <div className="text-sm text-cyan-600 relative z-10">
                        {feature.technicalDetails}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Business Benefits */}
        <div className="mx-auto max-w-4xl p-6 md:p-8 my-4 md:my-8">
          <div className="backdrop-blur-md bg-white/80 rounded-lg shadow-lg overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-600">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-600 drop-shadow-sm">
                Business Benefits
              </h2>
              <div className="space-y-3 mb-8">
                {data.developmentSolution.businessBenefits.map(
                  (benefit, index) => (
                    <div
                      key={index}
                      className="pl-4 border-l-2 border-cyan-400/50 hover:border-cyan-500 hover:pl-6 transition-all duration-300 text-gray-700 backdrop-blur-sm bg-cyan-50/30 p-3 rounded-r-lg"
                    >
                      {benefit}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div className="mx-auto max-w-4xl p-6 md:p-8 my-4 md:my-8">
          <div className="backdrop-blur-md bg-white/80 rounded-lg shadow-lg overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-600">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-600 drop-shadow-sm">
                Implementation Timeline - {data.implementation.totalDuration}
              </h2>
              <div className="space-y-6">
                {data.implementation.timeline.map((phase, index) => (
                  <div
                    key={index}
                    className="group backdrop-blur-sm bg-cyan-50/50 rounded-lg border border-cyan-100/50 hover:bg-cyan-50/70 transition-all duration-300 p-6"
                  >
                    <h3 className="text-xl font-bold mb-2 text-cyan-600">
                      {phase.phase} ({phase.duration})
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-cyan-600 mb-2">
                          Deliverables:
                        </h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((deliverable, idx) => (
                            <li
                              key={idx}
                              className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                            >
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cyan-600 mb-2">
                          Milestones:
                        </h4>
                        <ul className="space-y-2">
                          {phase.milestones.map((milestone, idx) => (
                            <li
                              key={idx}
                              className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                            >
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Investment Details */}
        <div className="mx-auto max-w-4xl p-6 md:p-8 my-4 md:my-8">
          <div className="backdrop-blur-md bg-white/80 rounded-lg shadow-lg overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-600">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-600 drop-shadow-sm">
                Investment Details
              </h2>
              <div className="backdrop-blur-sm bg-cyan-50/50 p-6 rounded-lg mb-6 hover:bg-cyan-50/70 transition-all duration-300 border border-cyan-100/50">
                <h3 className="text-xl font-bold mb-4 text-cyan-600">
                  Total Investment: ${data.investment.totalCost}
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-cyan-600 mb-2">
                      Payment Schedule:
                    </h4>
                    {data.investment.paymentSchedule.map((payment, index) => (
                      <div
                        key={index}
                        className="pl-4 border-l-2 border-cyan-400/50 mb-2"
                      >
                        <p className="text-gray-700">
                          {payment.percentage}% (${payment.amount}) -{" "}
                          {payment.milestone}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-600 mb-2">
                      Package Includes:
                    </h4>
                    <ul className="space-y-2">
                      {data.investment.packageIncludes.map((item, index) => (
                        <li
                          key={index}
                          className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-600 mb-2">Support:</h4>
                    <p className="text-gray-700 mb-2">
                      Duration: {data.investment.support.duration}
                    </p>
                    <ul className="space-y-2">
                      {data.investment.support.includes.map((item, index) => (
                        <li
                          key={index}
                          className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-600 mb-4">
                      Maintenance Plans:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(data.investment.maintenancePlans).map(
                        ([key, plan]) => (
                          <div
                            key={key}
                            className="backdrop-blur-sm bg-cyan-50/50 p-6 rounded-lg hover:bg-cyan-50/70 transition-all duration-300 border border-cyan-100/50"
                          >
                            <h5 className="text-lg font-bold text-cyan-600 mb-2">
                              {plan.name}
                            </h5>
                            <p className="text-cyan-600 font-semibold mb-4">
                              ${plan.price}/month
                            </p>
                            <ul className="space-y-2">
                              {plan.features.map(
                                (feature: string, index: number) => (
                                  <li
                                    key={index}
                                    className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                                  >
                                    {feature}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Requirements */}
        <div className="mx-auto max-w-4xl p-6 md:p-8 my-4 md:my-8">
          <div className="backdrop-blur-md bg-white/80 rounded-lg shadow-lg overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-600">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-600 drop-shadow-sm">
                Client Requirements
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-cyan-600">
                    Required Materials
                  </h3>
                  <ul className="space-y-2">
                    {data.clientRequirements.requiredInputs.map(
                      (input, index) => (
                        <li
                          key={index}
                          className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                        >
                          {input}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-cyan-600">
                    Approval Timelines
                  </h3>
                  <ul className="space-y-2">
                    {data.clientRequirements.approvalTimelines.map(
                      (timeline, index) => (
                        <li
                          key={index}
                          className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                        >
                          {timeline}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-cyan-600">
                    Technical Access Needed
                  </h3>
                  <ul className="space-y-2">
                    {data.clientRequirements.technicalAccess.map(
                      (access, index) => (
                        <li
                          key={index}
                          className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                        >
                          {access}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps and CTA */}
        <div className="mx-auto max-w-4xl p-6 md:p-8 my-4 md:my-8">
          <div className="backdrop-blur-md bg-white/80 rounded-lg shadow-lg overflow-hidden fade-in opacity-0 translate-y-4 transition-all duration-600">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-600 drop-shadow-sm">
                Next Steps
              </h2>
              <div className="space-y-6">
                {/* Timeline Info - Added this section */}
                <div className="backdrop-blur-sm bg-cyan-50/50 p-6 rounded-lg mb-6 hover:bg-cyan-50/70 transition-all duration-300 border border-cyan-100/50">
                  <h3 className="text-xl font-bold mb-4 text-cyan-600">
                    Timeline
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {data.nextSteps.timeline}
                  </p>
                </div>

                {/* Immediate Actions */}
                <div className="backdrop-blur-sm bg-cyan-50/50 p-6 rounded-lg mb-6 hover:bg-cyan-50/70 transition-all duration-300 border border-cyan-100/50">
                  <h3 className="text-xl font-bold mb-4 text-cyan-600">
                    Immediate Actions
                  </h3>
                  <ul className="space-y-2">
                    {data.nextSteps.immediateActions.map((action, index) => (
                      <li
                        key={index}
                        className="pl-4 border-l-2 border-cyan-400/50 text-gray-700"
                      >
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Section */}
                <div className="p-8 text-white text-center relative rounded-[32px]">
                  {/* Background with softer gradient */}
                  <div className="absolute inset-0 bg-[#00bcd4] rounded-[32px]" />

                  {/* Content */}
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-4">
                      {data.nextSteps.callToAction.heading}
                    </h2>
                    <p className="mb-6">
                      {data.nextSteps.callToAction.description}
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-8 py-3 bg-white text-cyan-600 rounded-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    >
                      Get in Touch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-600 text-sm backdrop-blur-sm">
          <p>Designed and Developed by {data.developer.name}</p>
          <p>© 2025 All Rights Reserved</p>
        </footer>

        {/* Modal */}
        {isModalOpen &&
          createPortal(
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsModalOpen(false);
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
            >
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-lg max-w-md w-full relative shadow-xl">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors text-2xl font-light"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-cyan-600">
                  Get in Touch
                </h2>
                <p className="mb-6 text-gray-700">
                  Choose your preferred contact method:
                </p>
                <div className="space-y-4">
                  <div className="relative group">
                    <button
                      onClick={() => setShowEmailOptions(!showEmailOptions)}
                      className="block w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-center rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Email Me
                    </button>
                    {showEmailOptions && (
                      <div className="mt-2 flex flex-col space-y-2">
                        <div
                          className="py-2 px-4 bg-gray-100 text-cyan-600 rounded-lg cursor-pointer relative group text-center"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "juanfrajf.contacto@gmail.com"
                            );
                            setEmailCopied(true);
                            setTimeout(() => setEmailCopied(false), 2000);
                          }}
                        >
                          {emailCopied ? (
                            <span className="block transition-opacity duration-300 opacity-100">
                              email copied!
                            </span>
                          ) : (
                            <span className="block">
                              juanfrajf.contacto@gmail.com
                            </span>
                          )}
                          <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Copy email
                          </span>
                        </div>
                        <a
                          href="mailto:juanfrajf.contacto@gmail.com"
                          className="block py-2 px-4 bg-gray-100 text-cyan-600 text-center rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                          Open in Email App
                        </a>
                      </div>
                    )}
                  </div>

                  <a
                    href="https://wa.me/+51952940311"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-center rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default ProjectBrief;
