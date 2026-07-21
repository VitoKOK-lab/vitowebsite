import { cookies } from "next/headers";
import type { IndustryKey, Role } from "@/lib/types";
import { getIndustryConfig } from "@/lib/industry/adapter";
import { ROLE_COOKIE, INDUSTRY_COOKIE } from "./cookies";

export { ROLE_COOKIE, INDUSTRY_COOKIE };

export interface Session {
  role: Role;
  industry: IndustryKey;
}

const VALID_ROLES: Role[] = ["owner", "manager", "staff", "customer"];
const VALID_INDUSTRIES: IndustryKey[] = ["factory", "ecom", "kitchen"];

/** Server-side:讀 cookie 取得目前 demo 身分,附預設值 */
export function getSession(): Session {
  const jar = cookies();
  const role = jar.get(ROLE_COOKIE)?.value as Role | undefined;
  const industry = jar.get(INDUSTRY_COOKIE)?.value as IndustryKey | undefined;
  return {
    role: role && VALID_ROLES.includes(role) ? role : "owner",
    industry:
      industry && VALID_INDUSTRIES.includes(industry) ? industry : "factory",
  };
}

export function getSessionIndustryConfig() {
  return getIndustryConfig(getSession().industry);
}
