import React from "react";
import AnimatedProjectPlaceholder from "@/components/AnimatedProjectPlaceholder";

export default function ImageProject({ src, alt = "" }) {
  const shouldUsePlaceholder = !src || src.endsWith("/coder-placeholder.svg");
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(shouldUsePlaceholder);

  const showImage = !errored && !shouldUsePlaceholder;

  return (
    <div className="relative aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
      {(!showImage || !loaded) && (
        <div className="absolute inset-0">
          <AnimatedProjectPlaceholder />
        </div>
      )}
      {showImage && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={["absolute inset-0 h-full w-full object-cover transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0"].join(" ")}
        />
      )}
    </div>
  );
}

