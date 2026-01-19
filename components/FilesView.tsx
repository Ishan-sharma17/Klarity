
import React from 'react';
import { ProjectFile } from '../types.ts';
import { FileText, Image, Figma, FileSpreadsheet, Download, MoreHorizontal, File } from 'lucide-react';
import { MOCK_FILES } from '../constants.ts';

const FilesView: React.FC = () => {
    const getIcon = (type: string) => {
        switch(type) {
            case 'FIGMA': return <Figma size={24} className="text-purple-500" />;
            case 'PDF': return <FileText size={24} className="text-red-500" />;
            case 'IMAGE': return <Image size={24} className="text-blue-500" />;
            case 'SHEET': return <FileSpreadsheet size={24} className="text-emerald-500" />;
            default: return <File size={24} className="text-slate-500" />;
        }
    };

    return (
        <div className="h-full p-6 bg-slate-50 dark:bg-[#0f1115] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Project Files</h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-500">Manage assets, specs, and documents.</p>
                </div>
                <button className="bg-semantic-ai text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-violet-700 transition-colors">
                    Upload File
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {MOCK_FILES.map(file => (
                    <div key={file.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 hover:shadow-lg hover:border-semantic-ai/30 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                                {getIcon(file.type)}
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                        
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-zinc-200 truncate mb-1" title={file.name}>
                            {file.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 mb-4">
                             <span>{file.size}</span>
                             <span>•</span>
                             <span>{file.uploadedAt}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
                             <div className="flex items-center gap-2">
                                 <img src={file.uploadedBy.avatar} className="w-5 h-5 rounded-full" title={`Uploaded by ${file.uploadedBy.name}`} />
                                 <span className="text-xs text-slate-400 dark:text-zinc-600 truncate max-w-[80px]">{file.uploadedBy.name}</span>
                             </div>
                             <button className="text-slate-400 hover:text-semantic-ai transition-colors">
                                 <Download size={16} />
                             </button>
                        </div>
                    </div>
                ))}
                
                {/* Upload Placeholder */}
                <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer min-h-[160px]">
                    <div className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-full mb-3">
                        <Download size={24} className="rotate-180 opacity-50" />
                    </div>
                    <span className="text-sm font-medium">Drop files to upload</span>
                </div>
            </div>
        </div>
    );
};

export default FilesView;
