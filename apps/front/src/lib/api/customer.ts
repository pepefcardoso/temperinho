import axiosClient from "@/lib/axios";

interface CreateContactData {
    name: string;
    email: string;
    phone: string;
    message: string;
}


export async function createContact(data: CreateContactData): Promise<boolean> {
    const response = await axiosClient.post<{ data: CreateContactData }>('/contact', data);
    return response.status === 200;
}

export async function subscribeToNewsletter(email: string): Promise<boolean> {
    const response = await axiosClient.post<{ data: string }>('/newsletter', { email });
    return response.status === 200;
}