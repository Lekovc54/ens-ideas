import { useQuery, gql } from "urql";

const RegistrationQuery = gql`
  query RegistrationQuery($name: String!) {
    registrations(where: { labelName: $name }) {
      domain {
        name
      }
    }
  }
`;

export const useRegistration = (name: string) => {
  const [result, reexecuteQuery] = useQuery({
    query: RegistrationQuery,
    variables: { name },
    pause: name === "",
  });

  const { data, error, fetching } = result;

  return {
    data,
    error,
    fetching,
    isRegistered: data ? data.registrations.length > 0 : null,
  };
};
