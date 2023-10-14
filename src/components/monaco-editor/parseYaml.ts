// SPDX-FileCopyrightText: 2023 Dash0 Inc.
// SPDX-License-Identifier: Apache-2.0

import { Parser } from "yaml";

export interface SourceToken {
	type:
		| "byte-order-mark"
		| "doc-mode"
		| "doc-start"
		| "space"
		| "comment"
		| "newline"
		| "directive-line"
		| "anchor"
		| "tag"
		| "seq-item-ind"
		| "explicit-key-ind"
		| "map-value-ind"
		| "flow-map-start"
		| "flow-map-end"
		| "flow-seq-start"
		| "flow-seq-end"
		| "flow-error-end"
		| "comma"
		| "block-scalar-header";
	offset: number;
	indent: number;
	source: string;
}

export interface IKey {
	type: string;
	offset: number;
	indent: number;
	source: string;
}

export interface IItem {
	key: IKey;
	sep: IKey[];
	start: [];
	value: IValue;
}

export interface IValue {
	indent: number;
	items: IItem[];
	offset: number;
	type: string;
	source?: string;
	end?: IKey[];
}

export interface Document {
	type: "document";
	offset: number;
	start: SourceToken[];
	value?: IValue;
	end?: SourceToken[];
}

export interface ILeaf {
	source?: string;
	offset: number;
}

export interface IValidateItem {
	[key: string]: ILeaf[];
}

export const getParsedValue = (editorValue: string) => {
	const value = editorValue;
	const parsedYaml = Array.from(new Parser().parse(value));
	const doc = parsedYaml.find((token) => token.type === "document") as Document;
	const docObject: IItem[] = doc?.value?.items ?? [];
	return docObject;
};

export function extractMainItemsData(docObject: IItem[]) {
	const mainItemsData: IValidateItem = {};

	const mainKeys = docObject
		.filter((item: IItem) => item.key.source !== "service")
		.map((item: IItem) => item.key.source);

	mainKeys.forEach((key: string) => {
		mainItemsData[key] =
			docObject
				.filter((item: IItem) => item.key.source === key)[0]
				?.value?.items?.map((item: IItem) => {
					return { source: item.key.source, offset: item.key.offset };
				}) || [];
	});
	return mainItemsData;
}

export function extractServiceItems(docObject: IItem[]) {
	const serviceItems = docObject.filter((item: IItem) => item.key.source === "service")[0]?.value.items;
	return serviceItems;
}

export function findLeafs(yamlItems?: IItem[], parent?: IItem, serviceItemsData?: IValidateItem) {
	if (yamlItems?.length === 0 || yamlItems === undefined) return {};
	else if (Array.isArray(yamlItems) && yamlItems.length > 0) {
		for (let i = 0; i < yamlItems.length; i++) {
			const item = yamlItems[i];
			if (item?.value) {
				if (item.value.source && parent) {
					const source = item.value.source;
					const offset = item.value.offset;
					const parentKey = parent.key.source;

					if (!serviceItemsData) return;
					if (!serviceItemsData[parentKey]) {
						serviceItemsData[parentKey] = [];
					}
					if (!serviceItemsData[parentKey]?.some((item: ILeaf) => item.source === source)) {
						serviceItemsData[parentKey]?.push({ source, offset });
					}
				} else if (Array.isArray(item.value.items)) {
					if (item.key) {
						findLeafs(item.value.items, item, serviceItemsData);
					}
				}
			}
		}
	}
	return serviceItemsData;
}

export function findLineAndColumn(config: string, targetOffset?: number) {
	const lines = config.length > 0 ? config.split("\n") : [];

	let currentOffset = 0;
	let lineIndex = 0;
	let column = 0;

	if (lines.length === 0 || (targetOffset && targetOffset < 0 && config.length)) {
		return { line: 0, column: 0 };
	}

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineLength = line?.length || 0;

		if (currentOffset + lineLength >= (targetOffset || 0)) {
			lineIndex = i + 1;
			column = (targetOffset || 0) - currentOffset + 1;
			break;
		}

		currentOffset += lineLength + 1;
	}

	return { line: lineIndex, column };
}