import React, { useState, useMemo } from 'react';
import { 
    Search, MoreHorizontal, Info, Smile, Paperclip, Mic, Send, 
    Hash, User as UserIcon, Calendar, CheckCircle2, Tag, 
    Link as LinkIcon, FileText, X, Plus, Image as ImageIcon,
    ThumbsUp, Heart, Zap, ChevronRight, Pin, Download, ExternalLink,
    File, FileSpreadsheet, Figma, MessageSquareQuote, Users
} from 'lucide-react';
import { CURRENT_USER, MOCK_USERS } from '../constants.ts';

interface SpacesViewProps {
    activeSpaceId?: string;
}

const SpacesView: React.FC<SpacesViewProps> = ({ activeSpaceId = 'ui-kit' }) => {
    const [messageText, setMessageText] = useState('');
    const [showInfoPanel, setShowInfoPanel] = useState(true);
    const [activeTab, setActiveTab] = useState<'Info' | 'Pins' | 'Files' | 'Links'>('Info');

    // --- MOCK SPACE DATA ---
    const spacesData: Record<string, any> = {
        'ui-kit': {
            name: 'UI-kit design',
            breadcrumbs: ['Spaces', 'v3.0', 'UI-kit design'],
            description: 'Central hub for all discussions related to the V3 Website UI Kit. Share assets, feedback, and design updates here.',
            created: 'May 28',
            activeTasks: 12,
            members: MOCK_USERS
        },
        'general': {
            name: 'General',
            breadcrumbs: ['Spaces', 'General'],
            description: 'Team announcements, general queries, and random watercooler talk.',
            created: 'Jan 10',
            activeTasks: 0,
            members: MOCK_USERS.slice(0, 3)
        },
        'front-end': {
            name: 'Front-end',
            breadcrumbs: ['Spaces', 'Development', 'Front-end'],
            description: 'Discussions regarding React implementation, component architecture, and performance optimization.',
            created: 'Mar 15',
            activeTasks: 8,
            members: [MOCK_USERS[0], MOCK_USERS[2], MOCK_USERS[3]]
        },
        'website': {
            name: 'Website',
            breadcrumbs: ['Spaces', 'Projects', 'Website'],
            description: 'Main channel for the corporate website revamp project.',
            created: 'Apr 02',
            activeTasks: 24,
            members: MOCK_USERS
        }
    };

    const currentSpace = spacesData[activeSpaceId] || spacesData['ui-kit'];

    const messages = [
        {
            id: 'm1',
            user: { name: 'Diana T.', avatar: 'https://picsum.photos/id/1025/200/200', role: 'Designer' },
            time: '2d ago',
            content: (
                <div className="space-y-3">
                    <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm">
                        I have already prepared all styles and components according to our standards during the design phase, so the UI kit is 90% complete. All that remains is to add some states to the interactive elements and prepare the Lottie files for animations.
                    </p>
                    <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm">
                        <span className="text-semantic-ai font-medium">@Emily D.</span>, please take a look and let me know if you have any questions.
                    </p>
                    {/* Rich Link Preview */}
                    <div className="flex items-center bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 gap-4 max-w-md group cursor-pointer hover:border-slate-300 dark:hover:border-zinc-600 transition-colors shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            Figma
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">Conceptzilla website v.3.0</h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-500 truncate">www.figma.com</p>
                        </div>
                        <button className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Quick view
                        </button>
                    </div>
                </div>
            ),
            reactions: [
                { emoji: '❤️', count: 1 },
                { emoji: '➕', count: 0, isAdd: true }
            ]
        },
        {
            id: 'm2',
            user: { name: 'Daniel A.', avatar: 'https://picsum.photos/id/1012/200/200', role: 'Art Director' },
            time: '3h ago',
            content: (
                <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm">
                    Okay, keep me updated. <span className="text-semantic-ai font-medium">@Diana T.</span> I also wanted to remind you to keep the layers organized.
                </p>
            ),
            reactions: []
        }
    ];

    // --- MOCK DATA FOR TABS ---

    const pinnedMessages = [
        { id: 'p1', user: 'Andrew M.', avatar: 'https://picsum.photos/id/1005/200/200', text: 'Please review the updated design system guidelines before submitting PRs.', date: 'May 28' },
        { id: 'p2', user: 'Daniel A.', avatar: 'https://picsum.photos/id/1012/200/200', text: 'Weekly sync is moved to Thursdays at 10 AM EST.', date: 'Jun 02' },
        { id: 'p3', user: 'Emily D.', avatar: 'https://picsum.photos/id/1027/200/200', text: 'Link to the new Icon Library assets.', date: 'Jun 05' },
    ];

    const sharedFiles = [
        { id: 'f1', name: 'UI_Kit_v3.fig', type: 'FIGMA', size: '124 MB', author: 'Diana T.', date: 'Yesterday' },
        { id: 'f2', name: 'Brand_Guidelines_2024.pdf', type: 'PDF', size: '4.2 MB', author: 'Andrew M.', date: 'May 30' },
        { id: 'f3', name: 'Hero_Banner_Assets.zip', type: 'ZIP', size: '45 MB', author: 'Daniel A.', date: 'May 28' },
        { id: 'f4', name: 'Typography_Scale.png', type: 'IMAGE', size: '2.1 MB', author: 'Diana T.', date: 'May 25' },
    ];

    const sharedLinks = [
        { id: 'l1', title: 'Competitor Analysis Board', url: 'miro.com/app/board/...', domain: 'miro.com', author: 'Andrew M.' },
        { id: 'l2', title: 'Jira Epic: Design System', url: 'jira.company.com/browse/...', domain: 'jira.company.com', author: 'Daniel A.' },
        { id: 'l3', title: 'React Aria Components', url: 'react-spectrum.adobe.com', domain: 'react-spectrum.adobe.com', author: 'Emily D.' },
    ];

    // --- HELPER FUNCTIONS ---

    const getFileIcon = (type: string) => {
        switch(type) {
            case 'FIGMA': return <Figma size={18} className="text-purple-500" />;
            case 'PDF': return <FileText size={18} className="text-red-500" />;
            case 'IMAGE': return <ImageIcon size={18} className="text-blue-500" />;
            case 'ZIP': return <File size={18} className="text-amber-500" />;
            default: return <File size={18} className="text-slate-400" />;
        }
    };

    return (
        <div className="flex h-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
            
            {/* Middle: Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0c0c0e]">
                {/* Header */}
                <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-xs font-bold">#</span>
                        {/* Dynamic Breadcrumbs */}
                        {currentSpace.breadcrumbs.map((crumb: string, index: number) => (
                            <React.Fragment key={index}>
                                <span className={`${index === currentSpace.breadcrumbs.length - 1 ? 'font-bold text-slate-900 dark:text-zinc-100' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200 cursor-pointer transition-colors'}`}>
                                    {crumb}
                                </span>
                                {index < currentSpace.breadcrumbs.length - 1 && (
                                    <span className="text-slate-300 dark:text-zinc-600">/</span>
                                )}
                            </React.Fragment>
                        ))}
                        <button className="ml-2 text-slate-400 hover:text-semantic-ai transition-colors"><Info size={14} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center -space-x-2 mr-4">
                            {currentSpace.members.slice(0,3).map((u: any) => (
                                <img key={u.id} src={u.avatar} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900" title={u.name} />
                            ))}
                            {currentSpace.members.length > 3 && (
                                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    +{currentSpace.members.length - 3}
                                </span>
                            )}
                        </div>
                        <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700 mx-1 hidden md:block"></div>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 transition-colors">
                            <Search size={18} />
                        </button>
                        <button 
                            className={`p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors ${showInfoPanel ? 'text-semantic-ai bg-semantic-ai/10' : 'text-slate-400'}`}
                            onClick={() => setShowInfoPanel(!showInfoPanel)}
                        >
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {/* Message Stream */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Intro Post */}
                    <div className="flex gap-4 group">
                        <img src="https://picsum.photos/id/1005/200/200" className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900" />
                        <div className="space-y-2 w-full">
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">Alex Chen</span>
                                <span className="text-xs text-slate-400">May 28</span>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl rounded-tl-none border border-slate-100 dark:border-zinc-800">
                                <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm">
                                    Hey team, I wanted to discuss the custom UI-kit we're developing for the site redesign. We need to finalize some components and make key design decisions to ensure consistency across the board. Let's make sure we cover colors, typography, buttons, and any other essential UI elements.
                                </p>
                                <p className="text-semantic-ai font-medium text-sm mt-2">@UX/UI @Sophia</p>
                            </div>
                            
                            {/* Reactions */}
                            <div className="flex gap-2 pt-1 pl-1">
                                <button className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full text-xs font-bold text-slate-600 dark:text-zinc-400 hover:border-amber-400 hover:text-amber-500 transition-colors shadow-sm">
                                    <span>👍</span> 2
                                </button>
                                <button className="flex items-center gap-1.5 px-2 py-1 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 rounded-full text-xs font-bold text-slate-400 transition-colors opacity-0 group-hover:opacity-100">
                                    <Smile size={14} />
                                    <Plus size={10} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Thread Divider */}
                    <div className="relative flex items-center justify-center py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 dark:border-zinc-800"></div>
                        </div>
                        <span className="relative bg-white dark:bg-[#0c0c0e] px-4 text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Yesterday</span>
                    </div>

                    {messages.map(msg => (
                        <div key={msg.id} className="flex gap-4 group">
                            <img src={msg.user.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900" />
                            <div className="space-y-1 w-full">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">{msg.user.name}</span>
                                    <span className="text-xs text-slate-400">{msg.time}</span>
                                </div>
                                <div className="max-w-3xl">{msg.content}</div>
                                {msg.reactions.length > 0 && (
                                    <div className="flex gap-2 pt-1">
                                        {msg.reactions.map((r, i) => (
                                            r.isAdd ? (
                                                <button key={i} className="flex items-center gap-1.5 px-2 py-1 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent rounded-full text-xs font-bold text-slate-400 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Smile size={14} /> <Plus size={10} />
                                                </button>
                                            ) : (
                                                <button key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm">
                                                    <span>{r.emoji}</span> {r.count > 0 && r.count}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 pt-2 bg-white dark:bg-[#0c0c0e]">
                    <div className="relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-semantic-ai/20 focus-within:border-semantic-ai transition-all">
                        {/* Member Suggestion Popup (Visual Mock) */}
                        {messageText.includes('@') && (
                            <div className="absolute bottom-full left-4 mb-2 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Members</div>
                                <div className="max-h-48 overflow-y-auto">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
                                        <img src="https://picsum.photos/id/1025/200/200" className="w-6 h-6 rounded-full" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Diana Taylor</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">
                                        <img src="https://picsum.photos/id/1012/200/200" className="w-6 h-6 rounded-full" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Daniel Anderson</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <textarea 
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder={`Reply to #${currentSpace.name}`}
                            className="w-full bg-transparent p-4 min-h-[60px] outline-none text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 resize-none"
                        />
                        <div className="flex items-center justify-between px-2 pb-2">
                            <div className="flex items-center gap-1 text-slate-400">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Plus size={18} /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Smile size={18} /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Zap size={18} /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Paperclip size={18} /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"><Mic size={18} /></button>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">Discard</button>
                                <button className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Info Panel (Redesigned) */}
            {showInfoPanel && (
                <div className="w-80 border-l border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121214] flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
                        <div className="flex bg-slate-200/50 dark:bg-zinc-800/50 p-1 rounded-xl">
                            {(['Info', 'Pins', 'Files', 'Links'] as const).map(tab => (
                                <button 
                                    key={tab} 
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all
                                        ${activeTab === tab 
                                            ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-sm' 
                                            : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
                                        }
                                    `}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 no-scrollbar">
                        
                        {/* --- INFO TAB --- */}
                        {activeTab === 'Info' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
                                {/* About Section (Card Style) */}
                                <section className="p-4 bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">About</h3>
                                    <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6">
                                        {currentSpace.description}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-100 dark:border-zinc-700/50">
                                            <div className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Created</div>
                                            <div className="text-sm font-bold text-slate-800 dark:text-white">{currentSpace.created}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-100 dark:border-zinc-700/50">
                                            <div className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Tasks</div>
                                            <div className="text-sm font-bold text-slate-800 dark:text-white">{currentSpace.activeTasks} Active</div>
                                        </div>
                                    </div>
                                </section>

                                {/* Activity Section (Bar Chart Style) */}
                                <section>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Activity</h3>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                                        <div className="flex gap-1 h-12 items-end mb-2">
                                            {Array.from({length: 12}).map((_, i) => {
                                                const active = i > 6;
                                                const height = 20 + Math.random() * 80; 
                                                const opacity = 0.3 + (i/12) * 0.7;
                                                return (
                                                    <div 
                                                        key={i} 
                                                        className="flex-1 rounded-sm transition-all bg-semantic-ai hover:bg-violet-400"
                                                        style={{ height: `${active ? height : 15}%`, opacity }}
                                                    />
                                                )
                                            })}
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold mt-2">
                                            <span>Mon</span>
                                            <span>High activity this week</span>
                                            <span>Sun</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Members Section (Updated List) */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Members ({currentSpace.members.length})</h3>
                                        <button className="p-1 text-semantic-ai hover:bg-semantic-ai/10 rounded transition-colors"><Plus size={14} /></button>
                                    </div>
                                    <div className="space-y-4">
                                        {currentSpace.members.map((m: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img src={m.avatar} className="w-9 h-9 rounded-full object-cover" />
                                                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-50 dark:border-[#121214] ${i === 0 ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 dark:text-zinc-100">{m.name}</div>
                                                        <div className="text-[10px] text-slate-500 dark:text-zinc-500">{m.role}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        <button className="w-full py-3 mt-2 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-white hover:bg-semantic-ai dark:hover:bg-semantic-ai/80 transition-all border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-transparent flex items-center justify-center gap-2 group">
                                            <Users size={14} className="group-hover:scale-110 transition-transform" />
                                            View all members
                                        </button>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* --- PINS TAB --- */}
                        {activeTab === 'Pins' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                                {pinnedMessages.map(pin => (
                                    <div key={pin.id} className="p-3 bg-white dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800 hover:border-semantic-ai/50 transition-colors cursor-pointer group shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src={pin.avatar} className="w-5 h-5 rounded-full" />
                                            <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">{pin.user}</span>
                                            <span className="text-[10px] text-slate-400">{pin.date}</span>
                                            <Pin size={12} className="ml-auto text-semantic-ai fill-semantic-ai" />
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                                            "{pin.text}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* --- FILES TAB --- */}
                        {activeTab === 'Files' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-3">
                                {sharedFiles.map(file => (
                                    <div key={file.id} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                                            {getFileIcon(file.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate mb-0.5">{file.name}</h4>
                                            <div className="text-[10px] text-slate-500 flex gap-1">
                                                <span>{file.size}</span>•<span>{file.date}</span>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* --- LINKS TAB --- */}
                        {activeTab === 'Links' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-3">
                                {sharedLinks.map(link => (
                                    <div key={link.id} className="p-3 bg-white dark:bg-zinc-800/50 rounded-xl border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group cursor-pointer shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">
                                                    <LinkIcon size={12} />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{link.domain}</span>
                                            </div>
                                            <ExternalLink size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-1 leading-snug">{link.title}</h4>
                                        <div className="text-[10px] text-slate-400">
                                            Shared by <span className="font-medium text-slate-600 dark:text-zinc-400">{link.author}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default SpacesView;