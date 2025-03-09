import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";

const features = [
  {
    title: "Real-Time Updates",
    description:
      "Experience seamless collaboration with live updates across all boards.",
    icon: "⚡",
  },
  {
    title: "Drag and Drop",
    description:
      "Easily move tasks between lists with intuitive drag and drop functionality.",
    icon: "🖱️",
  },
  {
    title: "Customizable Boards",
    description:
      "Personalize your workflow with flexible board configurations.",
    icon: "🎨",
  },
];

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <MaxWidthWrapper>
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default FeaturesSection;
