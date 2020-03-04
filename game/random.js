function RandomBetween (A, B)
{
  if(B < A)
  {
    return Math.random() * (A-B) + B;
  }
  return Math.random() * (B-A) + A; // 0-1 * End + Start
}