import Image from "next/image";
import Navigation from '@/app/components/ProfileNav'; 
import UploadModal from '@/app/components/UploadModal'; 

export default function FeedbackPage() {


    return (
    <div className='relative w-full min-h-[100dvh] flex flex-col'>
        {/* <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
            />
            
            <MediaViewerModal />  */}
            
            <Navigation />
        <p className="font-bold text-black self-center">hi</p>
    </div>

)}