import axios from "axios";
import API_PATHS from "~/constants/apiPaths";

type GetSignedUrlResponse = {
  signedUrl: string;
};

export async function getSignedUrl(
  fileName: string,
  importEndpoint = `${API_PATHS.import}/import`,
): Promise<string> {
  const encodedFileName = encodeURIComponent(fileName);
  const authorization_token = localStorage.getItem("authorization_token");

  const res = await axios.get<GetSignedUrlResponse>(
    `${importEndpoint}?name=${encodedFileName}`,
    {
      headers: {
        ...(authorization_token && {
          Authorization: `Basic ${authorization_token}`,
        }),
      },
    },
  );
  return res.data.signedUrl;
}

export async function uploadCsvToS3(signedUrl: string, file: File) {
  return axios.put(signedUrl, file, {
    headers: {
      "Content-Type": "text/csv",
    },
  });
}

export async function uploadImportFile(file: File) {
  const signedUrl = await getSignedUrl(file.name);
  await uploadCsvToS3(signedUrl, file);
}
