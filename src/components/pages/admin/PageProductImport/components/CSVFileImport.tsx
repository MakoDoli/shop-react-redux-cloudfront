import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { getSignedUrl, uploadCsvToS3 } from "~/queries/import";

type CSVFileImportProps = {
  url: string;
  title: string;
  onUploadSuccess?: () => void;
};

export default function CSVFileImport({
  url,
  title,
  onUploadSuccess,
}: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [isUploading, setIsUploading] = React.useState(false);
  const [step1Error, setStep1Error] = React.useState<string>();
  const [step2Error, setStep2Error] = React.useState<string>();
  const [successMessage, setSuccessMessage] = React.useState<string>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep1Error(undefined);
    setStep2Error(undefined);
    setSuccessMessage(undefined);

    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const isCsv = selectedFile.name.toLowerCase().endsWith(".csv");

      if (!isCsv) {
        setFile(undefined);
        setStep1Error("Please select a .csv file.");
        return;
      }

      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(undefined);
    setStep1Error(undefined);
    setStep2Error(undefined);
    setSuccessMessage(undefined);
  };

  const uploadFile = async () => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setStep1Error(undefined);
    setStep2Error(undefined);
    setSuccessMessage(undefined);

    let signedUrl: string;

    try {
      const response = await getSignedUrl(file.name, url);
      signedUrl = response;
    } catch {
      setStep1Error("Failed to get signed URL.");
      setIsUploading(false);
      return;
    }

    try {
      await uploadCsvToS3(signedUrl, file);
      setSuccessMessage("File uploaded and parsing started.");
      setFile(undefined);
      onUploadSuccess?.();
    } catch {
      setStep2Error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Import endpoint: {url}
      </Typography>
      {step1Error ? (
        <Alert severity="error" sx={{ mb: 1 }}>
          {step1Error}
        </Alert>
      ) : null}
      {step2Error ? (
        <Alert severity="error" sx={{ mb: 1 }}>
          {step2Error}
        </Alert>
      ) : null}
      {successMessage ? (
        <Alert severity="success" sx={{ mb: 1 }}>
          {successMessage}
        </Alert>
      ) : null}
      {!file ? (
        <input type="file" accept=".csv,text/csv" onChange={onFileChange} />
      ) : (
        <div>
          <Typography variant="body2" gutterBottom>
            Selected: {file.name}
          </Typography>
          <Button size="small" color="secondary" onClick={removeFile}>
            Remove file
          </Button>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={uploadFile}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload file"}
          </Button>
        </div>
      )}
    </Box>
  );
}
