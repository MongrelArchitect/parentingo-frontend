import UserInterface from "@interfaces/Users";

interface Props {
  user: UserInterface;
}

export default function Dashboard({ user }: Props) {
  console.log(user);
  return (
    <div>
      <h1>Welcome {user.name}!</h1>
    </div>
  );
}
