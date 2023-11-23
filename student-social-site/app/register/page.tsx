import { RegisterForm } from "./form";

export default function RegisterPage() {
  const divStyle = {
    background: 'url("signup.png")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    minHeight: "100vh",
  };

  return (
    <div
      style={divStyle}
      className="w-screen h-screen flex justify-end items-center bg-transparent font-Raleway"
    >
      <div className="flex flex-col sm:w-3/6 w-full min-h-fit sm:h-full h-fit bg-base-100 justify-start items-center  rounded duration-200 shadow-2xl hover:shadow-accent-focus">
        <p className="text-6xl font-Croissant font-semibold pt-10">Ascendre</p>
        <RegisterForm />
      </div>
    </div>
  );
}
