// SPDX-FileCopyrightText: 2023 Dash0 Inc.
// SPDX-License-Identifier: Apache-2.0

import { IconButton } from "@dash0hq/ui/src/components/ui/icon-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@dash0hq/ui/src/components/ui/tooltip";
import { useToast } from "@dash0hq/ui/src/components/ui/use-toast";
import { ArrowDownToLine, Copy } from "lucide-react";
import { type NextFont } from "next/dist/compiled/@next/font";
import { useBreadcrumbs } from "~/contexts/EditorContext";

export default function EditorTopBar({ config, font }: { config: string; font: NextFont }) {
	const { toast } = useToast();
	const { path } = useBreadcrumbs();

	function handleDownload() {
		const blob = new Blob([config], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = "config.yaml";
		link.href = url;
		link.click();
	}

	function handleCopy() {
		navigator.clipboard
			.writeText(config)
			.then(() => {
				toast({
					description: "Config copied to clipboard.",
				});
			})
			.catch((e) => {
				console.error("Failed to copy to clipboard", e);
				toast({
					description: "Failed to copy to clipboard",
				});
			});
	}

	return (
		<div className="flex shrink-0 items-center justify-between bg-default pl-16 pr-1 shadow-none">
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						style={{ direction: "rtl" }}
						className={`overflow-hidden text-left whitespace-nowrap overflow-ellipsis w-[80%] text-otelbinGrey font-normal text-[12px] ${font.className}`}
					>
						{path.slice(2)}
					</div>
				</TooltipTrigger>
				<TooltipContent>{path.slice(2)}</TooltipContent>
			</Tooltip>
			<div>
				<IconButton onClick={handleCopy} variant={"transparent"} size={"xs"}>
					<Copy />
				</IconButton>
				<IconButton onClick={handleDownload} variant={"transparent"} size={"xs"}>
					<ArrowDownToLine />
				</IconButton>
			</div>
		</div>
	);
}
