export interface Info {
  patient_name: string
  age: string
  height: string | null
  date: string
}

export interface TestDetail {
  unit: string
  value: string
}

export interface Report {
  [key: string]: TestDetail
}

export interface MedicalRecord {
  user_info: Info
  report: Report
}

export interface PatientFormValues {
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  contactNumber?: string
  email?: string
  address?: string
  medicalHistory?: string
}
