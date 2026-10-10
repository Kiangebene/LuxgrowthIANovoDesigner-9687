import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export * from './auth-schema';
export const audits = sqliteTable('lux_audits', { id: text('id').primaryKey(), userId: text('user_id'), url: text('url').notNull(), result: text('result').notNull(), createdAt: integer('created_at').notNull() });
export const leads = sqliteTable('lux_leads', { id: text('id').primaryKey(), userId: text('user_id').notNull(), name: text('name').notNull(), email: text('email').notNull(), company: text('company').notNull(), status: text('status').notNull(), note: text('note').notNull(), createdAt: integer('created_at').notNull() });
export const enquiries = sqliteTable('lux_enquiries', { id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull(), company: text('company').notNull(), message: text('message').notNull(), type: text('type').notNull(), createdAt: integer('created_at').notNull() });
