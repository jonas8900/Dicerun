import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});


const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unique-partygame-bucket.s3.eu-central-1.amazonaws.com",
        pathname: "/games/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
};
export default withPWA(nextConfig);
