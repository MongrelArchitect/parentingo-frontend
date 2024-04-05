import defaultAvatarIcon from "@assets/icons/account-circle.svg";

interface Props {
  avatarURL: string | undefined;
  maxWidth: number;
  invalid?: boolean;
}

export default function Avatar({ avatarURL, invalid, maxWidth }: Props) {
  const avatarStyle = {
    borderColor: invalid ? "#dc2626" : "#0f172a",
    maxWidth,
  };

  return (
    <img
      alt=""
      className="rounded-full border-2 h-auto w-full"
      src={avatarURL || defaultAvatarIcon}
      style={avatarStyle}
    />
  );
}
