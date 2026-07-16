-- ==========================================
-- BILLBUDDY AI - FULL STACK SCHEMA UPDATE
-- ==========================================
-- This script contains all the missing tables required to make the entire application functional.
-- Run this completely in your Supabase SQL Editor.

-- 1. GROUPS MODULE
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, name)
);

-- Update Bills to support groups
ALTER TABLE public.bills ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL;
ALTER TABLE public.bills ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- 2. PAYMENTS MODULE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    payer UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    receiver UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    payment_gateway TEXT NOT NULL,
    transaction_id TEXT,
    payment_status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. REMINDERS MODULE
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    bill_id UUID REFERENCES public.bills(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    channel TEXT DEFAULT 'In App',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. NOTIFICATIONS MODULE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SUBSCRIPTIONS MODULE (New)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    cycle TEXT NOT NULL CHECK (cycle IN ('Monthly', 'Yearly', 'Weekly')),
    next_billing_date DATE NOT NULL,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Groups Policies
CREATE POLICY "Users can create groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can view their groups" ON public.groups FOR SELECT USING (
    auth.uid() = created_by OR 
    id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their groups" ON public.groups FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their groups" ON public.groups FOR DELETE USING (auth.uid() = created_by);

-- Group Members Policies
CREATE POLICY "Users can manage members of their groups" ON public.group_members FOR ALL USING (
    group_id IN (SELECT id FROM public.groups WHERE created_by = auth.uid())
);
CREATE POLICY "Users can view members of their groups" ON public.group_members FOR SELECT USING (
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid()) OR
    group_id IN (SELECT id FROM public.groups WHERE created_by = auth.uid())
);

-- Payments Policies
CREATE POLICY "Users can view payments they are involved in" ON public.payments FOR SELECT USING (
    auth.uid() = payer OR auth.uid() = receiver OR 
    bill_id IN (SELECT id FROM public.bills WHERE created_by = auth.uid())
);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = payer OR auth.uid() = receiver);

-- Reminders Policies
CREATE POLICY "Users can view and create reminders for their bills" ON public.reminders FOR ALL USING (
    bill_id IN (SELECT id FROM public.bills WHERE created_by = auth.uid())
);

-- Notifications Policies
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can manage their own subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
