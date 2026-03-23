"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { GalleryModal } from "@/app/components/site/GalleryModal";
import { useProfileMedia } from "../mediaStore";

const MediaGrid = ({
  columnsClass,
  mediaClass,
  imageSizes,
  imageAlt,
}: {
  columnsClass: string;
  mediaClass: string;
  imageSizes: string;
  imageAlt: string;
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const galleryItems = useProfileMedia();

  return (
    <>
      {galleryItems.length > 0 ? (
        <div className={columnsClass}>
          {galleryItems.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="block w-full break-inside-avoid overflow-hidden rounded-3xl cursor-pointer active:scale-[.99]"
            >
              <div className="relative">
                {item.type === "video" ? (
                  <>
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={`${imageAlt} video thumbnail`}
                        width={1200}
                        height={1200}
                        className={mediaClass}
                        sizes={imageSizes}
                        unoptimized
                      />
                    ) : (
                      <video src={item.src} className={mediaClass} muted playsInline preload="metadata" />
                    )}
                    <div className="absolute right-3 top-3 rounded-full bg-black/45 p-2 text-white">
                      <Play size={16} fill="currentColor" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.src}
                    alt={imageAlt}
                    width={1200}
                    height={1200}
                    className={mediaClass}
                    sizes={imageSizes}
                    unoptimized={item.src.startsWith("blob:") || item.src.startsWith("data:")}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-6 py-16 text-center">
          {/* <p className="font-medium text-slate-500">No Media Yet</p> */}
          <p className="mt-3 text-[15px] font-medium text-slate-500">Upload your first image</p>

          <button className='relative mt-[20px] hover:scale-105 transition-transform duration-100 transform self-center active:scale-[.98] cursor-pointer whitespace-nowrap rounded-full p-[3px] w-[150px] py-[3px] bg-[linear-gradient(to_right,#007BFF,#66B2FF)] shadow-[0px_0px_10px_rgba(0,0,0,0.15)]'>
                                      <div className='flex flex-row gap-[10px] justify-center bg-[linear-gradient(to_left,#007BFF,#66B2FF)] rounded-full px-[15px] py-[12px] font-bold'>
                                              Upload
                                      </div>
                                  </button>

        </div>
      )}

      {selectedIndex !== null ? (
        <GalleryModal items={galleryItems} initialIndex={selectedIndex} onClose={() => setSelectedIndex(null)} />
      ) : null}
    </>
  );
};

export const MobileMediaGrid = () => (
  <MediaGrid columnsClass="columns-3 gap-2 space-y-2" mediaClass="min-h-[100px] w-full object-cover" imageSizes="50vw" imageAlt="User upload" />
);

export const DesktopMediaGrid = () => (
  <MediaGrid
    columnsClass="columns-3 min-[1150px]:columns-4 min-[1450px]:columns-5 gap-3 space-y-3"
    mediaClass="block h-auto w-full"
    imageSizes="(min-width: 1450px) 16vw, (min-width: 1150px) 20vw, 28vw"
    imageAlt="Media tile"
  />
);
