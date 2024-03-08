import { useContext } from "react";
import { UserContext } from "@contexts/Users";

export default function Home() {
  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-xl">Welcome {user.name}!</h1>
      <p>
        Lorem obcaecati in quo sunt officiis optio veritatis facere atque? Odit
        corrupti nobis magni quasi impedit Totam facilis iusto odit tenetur
        cumque? Possimus ut laborum saepe eum esse voluptatibus Nam odit itaque
        repudiandae quaerat recusandae. Eum sit voluptatem deserunt autem
        placeat. Facere labore est cupiditate ducimus tempore harum. Deleniti
        reprehenderit nisi amet quae placeat. Omnis in eius earum nisi officia
      </p>
    </div>
  );
}
