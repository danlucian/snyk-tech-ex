export default interface RegistryResponse {
  name: string;
  version: string;
  dependencies: { [key: string]: string };
}
