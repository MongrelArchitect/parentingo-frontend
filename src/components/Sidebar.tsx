import LinkStyled from "./LinkStyled";

export default function Sidebar() {
  const links = [
    { path: "/newgroup", text: "New group" },
    { path: "/groups", text: "All groups" },
    { path: "/groups/mine", text: "My groups" },
  ];

  return (
    <div className="flex gap-2 bg-sky-400 flex-wrap p-2 text-lg justify-between">
      {links.map((link) => {
        return (
          <LinkStyled
            key={link.path}
            to={link.path}
          >
            {link.text}
          </LinkStyled>
        );
      })}
    </div>
  );
}
