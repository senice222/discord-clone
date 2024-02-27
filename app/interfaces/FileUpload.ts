
export interface FileUploadProps {
	onChange: (value: string) => void;
	value: string;
	endpoint: "messageFile" | "serverImage"
}