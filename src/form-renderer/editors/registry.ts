import type { Question, QuestionKindKey } from '@/models'
import { defineAsyncComponent } from 'vue'
import CheckBoxEditor from './CheckBoxEditor.vue'
import FormActionEditor from './FormActionEditor.vue'
import NumberEditor from './NumberEditor.vue'
import QuestionListEditor from './QuestionListEditor.vue'
import SelectEditor from './SelectEditor.vue'
import TextAreaEditor from './TextAreaEditor.vue'
import TextEditor from './TextEditor.vue'
import type { EditorComponent } from './editor'

export default {
  text: TextEditor,
  number: NumberEditor,
  textarea: TextAreaEditor,
  select: SelectEditor as EditorComponent<Question>,
  boolean: CheckBoxEditor,
  'form-actions': FormActionEditor,
  'question-list': QuestionListEditor,
  json: defineAsyncComponent(() => import('./JsonEditor.vue')),
} as const satisfies { [K in QuestionKindKey]: EditorComponent<Question> }
