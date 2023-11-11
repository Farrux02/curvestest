import { api } from "@/shared/helpers";

const getFileInfo = async () => {
  return await api.get("/api/scripts/46769a");
};

export default getFileInfo;
