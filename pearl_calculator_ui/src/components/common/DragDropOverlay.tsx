import { FileDown, FileUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useDragDrop } from "@/hooks/use-drag-drop";

export function DragDropOverlay() {
	const { t } = useTranslation();
	const { isDragOver, isOnConfigurationPage, dismissOverlay } = useDragDrop();

	return (
		<AnimatePresence>
			{isDragOver && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-50 flex items-center justify-center"
					onClick={dismissOverlay}
				>
					<div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						transition={{ duration: 0.2, delay: 0.05 }}
						className="absolute inset-4 rounded-2xl border-2 border-dashed border-primary/40"
					/>

					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.2, delay: 0.1 }}
						className="relative flex flex-col items-center gap-3 pointer-events-none"
					>
						<div className="p-4 rounded-full bg-primary/10">
							{isOnConfigurationPage ? (
								<FileUp className="w-12 h-12 text-primary" />
							) : (
								<FileDown className="w-12 h-12 text-primary" />
							)}
						</div>

						<h2 className="text-xl font-semibold text-foreground">
							{isOnConfigurationPage
								? t("configuration_page.import_file_btn")
								: t("calculator.import_config_btn")}
						</h2>
						<p className="text-sm text-muted-foreground">
							{t("calculator.drop_hint")}
						</p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
