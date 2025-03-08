import React from "react";

const testimonials = [
  {
    name: "Jane Doe",
    role: "Project Manager",
    comment:
      "BoardFlow has transformed the way our team collaborates. The real-time updates and intuitive interface are game changers!",
    avatar: "https://via.placeholder.com/80",
  },
  {
    name: "John Smith",
    role: "Developer",
    comment:
      "The drag-and-drop functionality is so smooth and user-friendly. Organizing tasks has never been easier.",
    avatar: "https://via.placeholder.com/80",
  },
  {
    name: "Alice Johnson",
    role: "Designer",
    comment:
      "BoardFlow’s modern design and powerful features help keep our creative projects on track.",
    avatar: "https://via.placeholder.com/80",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 p-8 rounded-lg shadow-lg text-center"
            >
              <img
                className="w-16 h-16 rounded-full mx-auto mb-4"
                src={testimonial.avatar}
                alt={testimonial.name}
              />
              <p className="italic text-gray-700 mb-4">
                "{testimonial.comment}"
              </p>
              <h3 className="text-xl font-bold">{testimonial.name}</h3>
              <span className="text-gray-500">{testimonial.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
