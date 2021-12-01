import { readFile } from "fs/promises";
import { GetStaticProps, NextPage } from "next";
import { join } from "path";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import YAML from "yamljs";

interface SwaggerPageProps {
  spec: object;
}

const Swagger: NextPage<SwaggerPageProps> = ({ spec }) => (
  <SwaggerUI spec={spec} deepLinking />
);

export const getStaticProps: GetStaticProps<SwaggerPageProps> = async () => {
  const specFile = join(
    __dirname,
    "../../../documentation/system-design/book-bazar-openapi.yaml"
  );
  const spec = await readFile(specFile, "utf8");

  return {
    props: { spec: YAML.parse(spec) },
  };
};

export default Swagger;
