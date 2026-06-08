import client from './client'

export type CodeGenerateRequest = {
  language: string
  difficulty: string
  category?: string | null
}

export type CodeExampleResponse = {
  id: string
  language: string
  category: string | null
  difficulty: string
  code: string
  line_count: number
  source_type: 'ai' | 'github' | 'manual'
  source_url: string | null
  repo_name: string | null
  file_path: string | null
}

export const generateCode = async (body: CodeGenerateRequest): Promise<CodeExampleResponse> => {
  const { data } = await client.post<CodeExampleResponse>('/code/generate', body)
  return data
}

export const getCodeExample = async (exampleId: string): Promise<CodeExampleResponse> => {
  const { data } = await client.get<CodeExampleResponse>(`/code/${exampleId}`)
  return data
}
