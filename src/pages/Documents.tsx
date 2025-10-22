import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Download, ExternalLink, File } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MetaTags } from '@/components/MetaTags';

const doc_data = [
	{ name: 'Pitch Deck', file: '/PitchDeck.html', type: 'html' },
	{ name: 'Whitepaper', file: '/documents/SmartSentinelsWhitepaper v0.2.pdf', type: 'pdf' },
	{ name: 'Lightpaper', file: '/documents/LightpaperV0.2.pdf', type: 'pdf' },
	{ name: 'OnePager', file: '/documents/SmartSentinelsOnePager.pdf', type: 'pdf' },
	{ name: 'Terms and Conditions', file: '/documents/Terms and Conditions.pdf', type: 'pdf' },
	{ name: 'Privacy Policy', file: '/documents/Privacy Policy.pdf', type: 'pdf' },
	{ name: 'Disclaimer', file: '/documents/Disclaimer.pdf', type: 'pdf' },
	{ name: 'Token Sale Terms', file: '/documents/TokenSaleTerms.pdf', type: 'pdf' },
];

const Documents = () => {
	const [downloading, setDownloading] = useState<string | null>(null);

	const handleDownload = async (
		fileName: string,
		filePath: string,
		fileType: string
	) => {
		try {
			setDownloading(fileName);

			// Create a temporary link element to trigger download or open
			const link = document.createElement('a');
			link.href = filePath;
			link.target = '_blank';

			// Only set download for PDF files
			if (fileType === 'pdf') {
				link.download = fileName.toLowerCase().replace(/\s+/g, '-') + '.pdf';
			}

			// Append to body, click, and remove
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			// Reset downloading state after a short delay
			setTimeout(() => {
				setDownloading(null);
			}, 1000);
		} catch (error) {
			console.error('Action failed:', error);
			setDownloading(null);
		}
	};

	return (
		<>
			<MetaTags 
				description="Download official SmartSentinels documents: whitepaper, lightpaper, pitch deck, and legal resources for the decentralized AI platform."
				path="/documents"
			/>
			<div className="min-h-screen gradient-animate relative">
			{/* Blockchain & AI Themed Background Elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				{/* Circuit Board Pattern */}
				<div className="absolute inset-0 opacity-10">
					<svg
						className="w-full h-full"
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
					>
						<defs>
							<pattern
								id="docs-circuit"
								x="0"
								y="0"
								width="20"
								height="20"
								patternUnits="userSpaceOnUse"
							>
								<rect x="0" y="0" width="20" height="20" fill="none" />
								<circle
									cx="10"
									cy="10"
									r="1"
									fill="rgba(248, 244, 66, 0.3)"
								/>
								<line
									x1="10"
									y1="10"
									x2="20"
									y2="10"
									stroke="rgba(248, 244, 66, 0.2)"
									strokeWidth="0.5"
								/>
								<line
									x1="10"
									y1="10"
									x2="10"
									y2="0"
									stroke="rgba(248, 244, 66, 0.2)"
									strokeWidth="0.5"
								/>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#docs-circuit)" />
					</svg>
				</div>

				{/* Large Background Glows */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/3 to-transparent rounded-full blur-3xl animate-pulse" />
				<div
					className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-primary/4 to-transparent rounded-full blur-3xl animate-pulse"
					style={{ animationDelay: '3s' }}
				/>
			</div>

			<Navbar />

			<div className="relative z-10 min-h-screen flex flex-col">
				<div className="flex-1 flex items-center justify-center px-4 py-20">
					<div className="max-w-4xl mx-auto">
						{/* Header */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="text-center mb-16"
						>
							<h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 neon-glow">
								Project Documents
							</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Access our comprehensive documentation, whitepapers, and project
								materials
							</p>
						</motion.div>

						{/* Documents Grid */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="grid grid-cols-1 md:grid-cols-2 gap-6"
						>
							{doc_data.map((doc, index) => (
								<motion.div
									key={doc.name}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.1 * index }}
									className="glass-card-hover p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
												{doc.type === 'html' ? (
													<FileText size={24} className="text-primary" />
												) : (
													<File size={24} className="text-primary" />
												)}
											</div>
											<div>
												<h3 className="text-lg font-orbitron font-bold text-foreground mb-1">
													{doc.name}
												</h3>
												<p className="text-sm text-muted-foreground">
													{doc.type === 'pdf' ? 'PDF Document' : 'Web Page'}
												</p>
											</div>
										</div>

										<div className="flex space-x-2">
											<button
												onClick={() => window.open(doc.file, '_blank')}
												className="p-2 rounded-lg glass-card-hover hover:bg-primary/10 transition-all duration-200"
												title="Open in new tab"
											>
												<ExternalLink size={18} className="text-primary" />
											</button>

											{doc.type === 'pdf' && (
												<button
													className="p-2 rounded-lg glass-card-hover hover:bg-primary/10 transition-all duration-200 disabled:opacity-50"
													onClick={() =>
														handleDownload(doc.name, doc.file, doc.type)
													}
													disabled={downloading === doc.name}
													title={
														downloading === doc.name
															? 'Downloading...'
															: 'Download PDF'
													}
												>
													{downloading === doc.name ? (
														<div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
													) : (
														<Download size={18} className="text-primary" />
													)}
												</button>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>

						{/* Call to Action */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
							className="text-center mt-16"
						>
							<div className="glass-card-hover p-8 max-w-2xl mx-auto">
								<h3 className="text-2xl font-orbitron font-bold text-foreground mb-4">
									Ready to Get Started?
								</h3>
								<p className="text-muted-foreground mb-6">
									Join the SmartSentinels community and be part of the
									decentralized AI revolution.
								</p>
								<a
									href="/hub"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(248,244,66,0.5)] hover:shadow-[0_0_30px_rgba(248,244,66,0.7)] font-orbitron font-bold transition-all duration-200"
								>
									<span>Access Hub</span>
									<ExternalLink size={18} />
								</a>
							</div>
						</motion.div>
					</div>
				</div>
				<Footer />
			</div>
		</div>
		</>
	);
};

export default Documents;