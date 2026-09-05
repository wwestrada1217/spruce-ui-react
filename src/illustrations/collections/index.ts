import type { IllustrationDefinition } from '../illustration-definition.js'

export * from './status.illustrations.js'
export * from './hr.illustrations.js'
export * from './payroll.illustrations.js'
export * from './finance.illustrations.js'
export * from './tech.illustrations.js'
export * from './inventory.illustrations.js'
export * from './project-management.illustrations.js'
export * from './helpdesk.illustrations.js'
export * from './security.illustrations.js'
export * from './document.illustrations.js'
export * from './people.illustrations.js'
export * from './sales-marketing.illustrations.js'
export * from './telecommunications.illustrations.js'
export * from './transportation.illustrations.js'
export * from './shipping.illustrations.js'
export * from './construction.illustrations.js'
export * from './agriculture.illustrations.js'
export * from './petro-fuel.illustrations.js'
export * from './education.illustrations.js'
export * from './healthcare.illustrations.js'
export * from './science.illustrations.js'
export * from './pet-care.illustrations.js'
export * from './jobs-labor.illustrations.js'
export * from './robotics.illustrations.js'

import { STATUS_ILLUSTRATIONS } from './status.illustrations.js'
import { HR_ILLUSTRATIONS } from './hr.illustrations.js'
import { PAYROLL_ILLUSTRATIONS } from './payroll.illustrations.js'
import { FINANCE_ILLUSTRATIONS } from './finance.illustrations.js'
import { TECH_ILLUSTRATIONS } from './tech.illustrations.js'
import { INVENTORY_ILLUSTRATIONS } from './inventory.illustrations.js'
import { PROJECT_MANAGEMENT_ILLUSTRATIONS } from './project-management.illustrations.js'
import { HELPDESK_ILLUSTRATIONS } from './helpdesk.illustrations.js'
import { SECURITY_ILLUSTRATIONS } from './security.illustrations.js'
import { DOCUMENT_ILLUSTRATIONS } from './document.illustrations.js'
import { PEOPLE_ILLUSTRATIONS } from './people.illustrations.js'
import { SALES_MARKETING_ILLUSTRATIONS } from './sales-marketing.illustrations.js'
import { TELECOMMUNICATIONS_ILLUSTRATIONS } from './telecommunications.illustrations.js'
import { TRANSPORTATION_ILLUSTRATIONS } from './transportation.illustrations.js'
import { SHIPPING_ILLUSTRATIONS } from './shipping.illustrations.js'
import { CONSTRUCTION_ILLUSTRATIONS } from './construction.illustrations.js'
import { AGRICULTURE_ILLUSTRATIONS } from './agriculture.illustrations.js'
import { PETRO_FUEL_ILLUSTRATIONS } from './petro-fuel.illustrations.js'
import { EDUCATION_ILLUSTRATIONS } from './education.illustrations.js'
import { HEALTHCARE_ILLUSTRATIONS } from './healthcare.illustrations.js'
import { SCIENCE_ILLUSTRATIONS } from './science.illustrations.js'
import { PET_CARE_ILLUSTRATIONS } from './pet-care.illustrations.js'
import { JOBS_LABOR_ILLUSTRATIONS } from './jobs-labor.illustrations.js'
import { ROBOTICS_ILLUSTRATIONS } from './robotics.illustrations.js'

/** Complete collection of all Spruce UI vector illustrations. */
export const ALL_ILLUSTRATIONS: readonly IllustrationDefinition[] = [
  ...STATUS_ILLUSTRATIONS,
  ...HR_ILLUSTRATIONS,
  ...PAYROLL_ILLUSTRATIONS,
  ...FINANCE_ILLUSTRATIONS,
  ...TECH_ILLUSTRATIONS,
  ...INVENTORY_ILLUSTRATIONS,
  ...PROJECT_MANAGEMENT_ILLUSTRATIONS,
  ...HELPDESK_ILLUSTRATIONS,
  ...SECURITY_ILLUSTRATIONS,
  ...DOCUMENT_ILLUSTRATIONS,
  ...PEOPLE_ILLUSTRATIONS,
  ...SALES_MARKETING_ILLUSTRATIONS,
  ...TELECOMMUNICATIONS_ILLUSTRATIONS,
  ...TRANSPORTATION_ILLUSTRATIONS,
  ...SHIPPING_ILLUSTRATIONS,
  ...CONSTRUCTION_ILLUSTRATIONS,
  ...AGRICULTURE_ILLUSTRATIONS,
  ...PETRO_FUEL_ILLUSTRATIONS,
  ...EDUCATION_ILLUSTRATIONS,
  ...HEALTHCARE_ILLUSTRATIONS,
  ...SCIENCE_ILLUSTRATIONS,
  ...PET_CARE_ILLUSTRATIONS,
  ...JOBS_LABOR_ILLUSTRATIONS,
  ...ROBOTICS_ILLUSTRATIONS,
] as const

export const ILLUSTRATIONS_BY_NAME: Readonly<Record<string, IllustrationDefinition>> =
  Object.fromEntries(ALL_ILLUSTRATIONS.map(item => [item.name, item]))
