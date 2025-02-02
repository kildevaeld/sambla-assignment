import type { AnswerType, Question } from "@/models";
import type { Component } from "vue";

export interface Aria {
	editor: string;
	hint: string;
	error: string;
}

export interface EditorProps<Q extends Question> {
	question: Q;
	aria: Aria;
	value?: AnswerType<Q>;
	invalid?: boolean;
}

export type EditorEmits<Q extends Question> = {
	input: [value: AnswerType<Q>];
	blur: [];
	focus: [];
};

export type EditorComponent<Q extends Question> = Component<
	EditorProps<Q>,
	never,
	never,
	never,
	never,
	EditorEmits<Q>
>;
